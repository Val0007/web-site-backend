# ---- Atlas ----------------------------------------------------------------

variable "atlas_project_id" {
  description = "Atlas project that contains the cluster (Project Settings -> Project ID)."
  type        = string
}

variable "atlas_cluster_name" {
  description = "Name of the existing cluster, e.g. Cluster0."
  type        = string
  default     = "Cluster0"
}

variable "atlas_backing_provider" {
  description = "Cloud provider of the free cluster: AWS, GCP or AZURE. Must match the real cluster or Terraform will want to replace it."
  type        = string
}

variable "atlas_region" {
  description = "Atlas region name of the free cluster, e.g. EU_NORTH_1. Must match the real cluster."
  type        = string
}

variable "db_name" {
  description = "Database the backend uses (DB_NAME)."
  type        = string
  default     = "zipfolio"
}

variable "db_username" {
  description = "Database user created for the backend."
  type        = string
  default     = "zipfolio_app"
}

# ---- Render ---------------------------------------------------------------

variable "render_service_name" {
  description = "Service name. Render uses it for the public URL when it is free, so keep it distinctive."
  type        = string
  default     = "zipfolio-backend-kth"
}

variable "render_plan" {
  description = "Render plan. The provider docs list starter and up; free may or may not be accepted."
  type        = string
  default     = "free"
}

variable "render_region" {
  type    = string
  default = "frankfurt"
}

variable "image_url" {
  description = "Image without a tag. Must stay identical to what the CI deploy hook sends (only the tag may differ)."
  type        = string
  default     = "ghcr.io/val0007/web-site-backend"
}

variable "image_tag" {
  description = "Tag the service starts on. CI deploys later releases by commit SHA."
  type        = string
  default     = "latest"
}

variable "backend_url" {
  description = "Public URL of the backend, no trailing slash or path. Used for the Google OAuth callback."
  type        = string
  default     = "https://zipfolio-backend-kth.onrender.com"
}

variable "admin_url" {
  description = "Admin panel URL users are sent back to after Google login."
  type        = string
}

variable "google_client_id" {
  type      = string
  sensitive = true
}

variable "google_client_secret" {
  type      = string
  sensitive = true
}
