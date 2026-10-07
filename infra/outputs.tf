output "service_url" {
  description = "Render URL of the backend."
  value       = render_web_service.backend.url
}

output "mongo_host" {
  description = "Atlas SRV host (no credentials)."
  value       = mongodbatlas_advanced_cluster.main.connection_strings.standard_srv
}
