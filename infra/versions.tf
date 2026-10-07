terraform {
  required_version = ">= 1.5"

  required_providers {
    render = {
      source = "render-oss/render"
    }
    mongodbatlas = {
      source  = "mongodb/mongodbatlas"
      version = ">= 2.0"
    }
    random = {
      source = "hashicorp/random"
    }
  }
}

# Credentials are read from the environment, never from files in the repo:
#   RENDER_API_KEY, RENDER_OWNER_ID
#   MONGODB_ATLAS_PUBLIC_KEY, MONGODB_ATLAS_PRIVATE_KEY
provider "render" {}

provider "mongodbatlas" {}
