use Mix.Config

# In this file, we keep production configuration that
# you likely want to automate and keep it away from
# your version control system.
config :app, App.Endpoint,
    secret_key_base: "4MSW61epDlBVPh6QfZUsRNEVWtOlUd3rNFzdT/Vq5qJvnrtJ7B9dgrqJSSk0qiRF"

# Configure your database
config :app, App.Repo,
    adapter: Ecto.Adapters.Postgres,
    username: "postgres",
    password: "postgres",
    database: "app_prod"
