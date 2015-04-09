
include_recipe 'apt'
include_recipe 'nginx'
include_recipe 'git'
include_recipe 'python'
include_recipe 'elixir'
include_recipe 'nodejs'

skeleton = node[:skeleton]
app_user = skeleton[:app_user]
db = skeleton[:db]
python_env = skeleton[:python][:virtualenv]
site_dir = skeleton[:site_dir]
site_name = skeleton[:site_name]
script_dir = "#{site_dir}/scripts"

%w{
    libjpeg-dev
    zlib1g-dev
    libpng12-dev
    libpq-dev
    libffi-dev
}.each do |pkg|
    package pkg do
        action :install
    end
end

user app_user do
    home "/home/#{app_user}"
    shell '/bin/bash'
    supports :manage_home => true
    action :create
end

[skeleton[:log_dir], script_dir].each do |dir|
    directory dir do
        owner app_user
        action :create
        recursive true
    end
end

dirs = [
    "priv/static/uploads",
]
dirs.each do |component|

    the_dir = "#{site_dir}/#{component}"

    bash 'setup permissions' do
        code <<-EOH
            mkdir -p #{the_dir}
            chown -R #{app_user} #{the_dir}
            chgrp -R www-data #{the_dir}
            chmod -R g+rw #{the_dir}
            find #{the_dir} -type d | xargs chmod g+x
        EOH
    end
end

template "#{script_dir}/set_env.sh" do
    source 'set_env.sh.erb'
    mode '755'
end

template "#{script_dir}/skeleton.sh" do
    source 'skeleton.sh.erb'
    mode '755'
end

template "/etc/init/#{site_name}.conf" do
    source 'upstart_skeleton.erb'
    mode '644'
end

#deploy script
template "#{script_dir}/deploy.sh" do
    source 'deploy.sh.erb'
    mode '755'
end

#db config
template "#{site_dir}/config/db.json" do
    source 'db.json.erb'
    mode '644'
end

directory python_env do
    action :create
    recursive true
end

python_virtualenv python_env do
    action :create
end

# Installing from requirements.txt
bash 'install python dependencies' do
    code <<-EOH
        . #{python_env}/bin/activate
        pip install -r #{site_dir}/requirements.txt
    EOH
end

# Install nodejs dependencies
execute 'Install nodejs dependencies' do
    command 'npm install -g bower gulp browserify'
end

service site_name do
    provider Chef::Provider::Service::Upstart
    action [:enable, :start]
end

# Install schemup dependencies
#bash 'install schemup dependencies' do
#    code <<-EOH
#        . #{python_env}/bin/activate
#        pip install -r #{site_dir}/schema/requirements.txt
#    EOH
#end

#bash 'run schemup' do
#    cwd "#{site_dir}/schema"
#    code <<-EOH
#        . #{python_env}/bin/activate
#        python update.py commit
#    EOH
#end

# Nginx
template "/etc/nginx/sites-available/#{site_name}" do
    source 'nginx_skeleton.erb'
    mode '644'
    notifies :reload, 'service[nginx]'
end

nginx_site site_name do
    action :enable
end

nginx_site 'default' do
    enable false
end

template "/etc/logrotate.d/#{site_name}" do
    source 'logrotate.erb'
    mode '644'
end
