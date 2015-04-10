skeleton = node[:skeleton]
db = skeleton[:db]
site_dir = skeleton[:site_dir]

include_recipe 'postgresql::server'

pg_user db[:user] do
  privileges superuser: true, createdb: true, login: true
  password db[:password]
end

pg_database db[:database] do
  owner db[:user]
  encoding "utf8"
  template "template0"
  locale "en_US.UTF8"
end
