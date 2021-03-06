defmodule App.Endpoint do
    use Phoenix.Endpoint, otp_app: :app

    # Serve at "/" the given assets from "priv/static" directory
    plug Plug.Static,
        at: "/", from: :app,
        only: ~w(resource images favicon.ico robots.txt)

    # Code reloading can be explicitly enabled under the
    # :code_reloader configuration of your endpoint.
    if code_reloading? do
        # plug Phoenix.LiveReloader
        plug Phoenix.CodeReloader
    end

    plug Plug.Logger

    plug Plug.Parsers,
        parsers: [:urlencoded, :multipart, :json],
        pass: ["*/*"],
        json_decoder: Poison

    plug Plug.MethodOverride
    plug Plug.Head

    plug Plug.Session,
        store: :cookie,
        key: "_app_key",
        signing_salt: "iOodTjXx",
        encryption_salt: "/xW263pg"

    plug :router, App.Router
end
