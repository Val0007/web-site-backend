# ---------------------------------------------------------------------------
# MongoDB Atlas
# ---------------------------------------------------------------------------

# Existing free cluster. Import it first (see README); never create or replace it blindly.
resource "mongodbatlas_advanced_cluster" "main" {
  project_id   = var.atlas_project_id
  name         = var.atlas_cluster_name
  cluster_type = "REPLICASET"

  replication_specs = [
    {
      region_configs = [
        {
          electable_specs = {
            instance_size = "M0"
          }
          provider_name         = "TENANT"
          backing_provider_name = var.atlas_backing_provider
          region_name           = var.atlas_region
          priority              = 7
        }
      ]
    }
  ]

  # A free cluster cannot be replaced without losing its data.
  lifecycle {
    prevent_destroy = true
  }
}

# Password for the backend's database user is generated here, so nobody has to
# type it or paste it into Render. It is stored (sensitive) in Terraform state.
resource "random_password" "db_user" {
  length  = 32
  special = false
}

resource "mongodbatlas_database_user" "backend" {
  project_id         = var.atlas_project_id
  username           = var.db_username
  password           = random_password.db_user.result
  auth_database_name = "admin"

  roles {
    role_name     = "readWrite"
    database_name = var.db_name
  }
}

# Render's free plan has no fixed outbound IP, so Atlas has to accept any address.
resource "mongodbatlas_project_ip_access_list" "anywhere" {
  project_id = var.atlas_project_id
  cidr_block = "0.0.0.0/0"
  # Keep the comment identical to the existing rule; a different one forces a
  # destroy and recreate, which would briefly block every connection.
  comment = "allow all connects"
}

locals {
  # connection_strings.standard_srv looks like mongodb+srv://cluster0.xxxx.mongodb.net
  mongo_uri = replace(
    mongodbatlas_advanced_cluster.main.connection_strings.standard_srv,
    "mongodb+srv://",
    "mongodb+srv://${var.db_username}:${random_password.db_user.result}@"
  )
}

# ---------------------------------------------------------------------------
# Render
# ---------------------------------------------------------------------------

# Rotating this logs every user out once, because tokens are signed with it.
resource "random_password" "jwt" {
  length  = 48
  special = false
}

resource "render_web_service" "backend" {
  name   = var.render_service_name
  plan   = var.render_plan
  region = var.render_region

  # Runs the image that CI pushes to GHCR. The tag here is only the starting
  # point: every release is deployed by the CI deploy hook with the commit SHA.
  runtime_source = {
    image = {
      image_url = var.image_url
      tag       = var.image_tag
    }
  }

  health_check_path = "/"

  # The service must not restart with the new MONGO_URI before the database user
  # and the network rule exist.
  depends_on = [
    mongodbatlas_database_user.backend,
    mongodbatlas_project_ip_access_list.anywhere,
  ]

  # CI changes the running image on every release. Without this, the next plan
  # would see a different tag than the one written here and try to revert it.
  lifecycle {
    ignore_changes = [runtime_source]
  }

  env_vars = {
    NODE_ENV             = { value = "production" }
    MONGO_URI            = { value = local.mongo_uri }
    DB_NAME              = { value = var.db_name }
    JWT_SECRET           = { value = random_password.jwt.result }
    GOOGLE_CLIENT_ID     = { value = var.google_client_id }
    GOOGLE_CLIENT_SECRET = { value = var.google_client_secret }
    BACKEND_URL          = { value = var.backend_url }
    ADMIN_URL            = { value = var.admin_url }
  }
}
