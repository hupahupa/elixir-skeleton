default[:skeleton][:site_name] = 'skeleton'
default[:skeleton][:app_name] = 'skeleton'
default[:skeleton][:app_user] = 'skeleton'
default[:skeleton][:db][:database] = 'skeleton'
default[:skeleton][:db][:host] = 'localhost'
default[:skeleton][:db][:user] = 'skeleton'
default[:skeleton][:secret_key] = 'dHKEf1IXUVQzs9ubg6pHULHaAOUaL0pod'
default[:skeleton][:python][:virtualenv] = '/home/skeleton/.virtualenvs/skeleton'
default[:skeleton][:server_aliases] = []

default[:nvm][:reference] = 'v0.5.1'
set[:nodejs][:version] = '0.10.18'
set[:nodejs][:npm][:version] = '1.3.8'

#environment: local or dev or prod
default[:skeleton][:env] = 'dev'

#db log debug
default[:skeleton][:db][:debug] = false

#emails
default[:skeleton][:emails][:admin] = 'duylm@cogini.com'

#email to send error
default[:skeleton][:emails][:errors] = [
]
default[:skeleton][:emails][:debug] = false

default[:skeleton][:debug] = true

default[:nginx][:client_max_body_size] = '3M'
default[:skeleton][:blocked_keywords] = [
    "/phpMyAdmin",
    "/mysqladmin",
    "/muieblackcat",
    "/manager/html",
    "/test",
    "/proxy.txt",
    ".php",
]
