# Infrastructure (Terraform)

Describes the Render backend service and the MongoDB Atlas free cluster, user
and network rule. Credentials are never stored here.

## Credentials (environment variables)

```bash
export RENDER_API_KEY=...            # Render -> Account Settings -> API Keys
export RENDER_OWNER_ID=usr-...       # or tea-...; shown in workspace settings
export MONGODB_ATLAS_PUBLIC_KEY=...  # Atlas -> Access Manager -> API Keys
export MONGODB_ATLAS_PRIVATE_KEY=...
export TF_VAR_google_client_id=...
export TF_VAR_google_client_secret=...
```

Copy `terraform.tfvars.example` to `terraform.tfvars` (gitignored) and fill in
the non-secret values. `atlas_backing_provider` and `atlas_region` must match
the existing cluster exactly.

## First run: import what already exists

The service and the cluster already exist, so import them instead of creating
new ones (a new Render service gets a new URL, and a free Atlas cluster cannot
be replaced without losing data).

```bash
cd infra
terraform init
terraform import mongodbatlas_advanced_cluster.main <ATLAS_PROJECT_ID>-<CLUSTER_NAME>
terraform import render_web_service.backend <SERVICE_ID>          # srv-... from the service URL in Render
# only if 0.0.0.0/0 is already in Atlas Network Access:
terraform import mongodbatlas_project_ip_access_list.anywhere <ATLAS_PROJECT_ID>-0.0.0.0/0
terraform plan
```

Read the plan before applying. It must **not** show the cluster being
destroyed or replaced (`prevent_destroy` will stop it, but fix the cause). Env
vars on the Render service and the database user will show as changes: that is
expected, because Terraform now owns them (a new generated database password
and JWT secret; users have to log in again once).

After `apply` works, delete the old manually created Atlas database user and
check `GET <service URL>/flags` still returns 200.

## How releases reach Render

Terraform creates the service pointed at `ghcr.io/val0007/web-site-backend:latest`
and then ignores the image (`ignore_changes = [runtime_source]`). Releases are
not done by Terraform: on every merge to `main`, GitHub Actions builds
`Dockerfile.prod`, pushes the image to GHCR tagged with the commit SHA, and
calls the service's deploy hook with `imgURL=ghcr.io/val0007/web-site-backend:<sha>`.
The GHCR package must be public (or Render needs a registry credential).

The Render provider cannot update free-tier web services, so to change a
Render setting either replace the service (`terraform apply -replace=render_web_service.backend`)
or edit it by hand.

## Things Terraform does not manage

Google OAuth client and redirect URI, the Render deploy hook and the GitHub
secret that holds it, GitHub rulesets and Dependabot.

## State

State is local and gitignored. It contains the generated database password,
the JWT secret and the Google secret, so never commit it. Move it to a private
remote backend (for example Terraform Cloud) before sharing the project.
