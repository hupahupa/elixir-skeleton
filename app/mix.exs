defmodule App.Mixfile do
    use Mix.Project

    def project do
        [app: :app,
         version: "0.0.1",
         elixir: "~> 1.0",
         elixirc_paths: ["lib", "web"],
         compilers: [:phoenix] ++ Mix.compilers,
         build_embedded: Mix.env == :prod,
         start_permanent: Mix.env == :prod,
         deps: deps]
    end

    # Configuration for the OTP application
    #
    # Type `mix help compile.app` for more information
    def application do
        [mod: {App, []},
         applications: [:phoenix, :cowboy, :logger, :ecto]]
    end

    # Specifies your project dependencies
    #
    # Type `mix help deps` for examples and options
    defp deps do
        [{:phoenix, github: "phoenixframework/phoenix", override: true},
         {:phoenix_ecto, "~> 0.3"},
         {:postgrex, ">= 0.0.0"},
         # TODO bump to 0.3 for phoenix 0.11 release
         # {:phoenix_live_reload, "~> 0.3"},
         {:cowboy, "~> 1.0"}]
    end
end
