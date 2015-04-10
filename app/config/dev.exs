use Mix.Config

config :app, App.Endpoint,
    http: [port: 4000],
    debug_errors: true,
    code_reloader: true,
    cache_static_lookup: false

# Watch static and templates for browser reloading.
config :app, App.Endpoint,
    live_reload: [
        patterns: [
            ~r{priv/static/.*(js|css|png|jpeg|jpg|gif)$},
            ~r{web/views/.*(ex)$},
            ~r{web/templates/.*(eex)$}
        ]
    ]

# Do not include metadata nor timestamps in development logs
config :logger, :console, format: "[$level] $message\n"

# Configure your database
config :app, App.Repo,
    adapter: Ecto.Adapters.Postgres,
    username: "postgres",
    password: "postgres",
    database: "app_dev"
