# -*- mode: ruby -*-
# vi: set ft=ruby :

# Vagrantfile API/syntax version. Don't touch unless you know what you're doing!
VAGRANTFILE_API_VERSION = "2"

Vagrant.configure(VAGRANTFILE_API_VERSION) do |config|

    config.vm.box = "trusty64"
    config.vm.box_url = 'http://boxes.cogini.com/trusty64.box'

    http_port = 9500
    ssh_port = 9501    

    config.vm.network :forwarded_port, guest: 4000, host: http_port
    config.vm.network :forwarded_port, guest: 22, host: ssh_port, id: "ssh", auto_correct: true    

    # apt wants the partial folder to be there
    apt_cache = './.cache/apt'
    FileUtils.mkpath "#{apt_cache}/partial"

    chef_cache = '/var/chef/cache'

    shared_folders = {
        apt_cache => '/var/cache/apt/archives',
        './.cache/chef' => chef_cache,
    }

    config.vm.provider :virtualbox do |vb|

        #vb.gui = true

        shared_folders.each do |source, destination|
            FileUtils.mkpath source
            config.vm.synced_folder source, destination
            vb.customize ['setextradata', :id, "VBoxInternal2/SharedFoldersEnableSymlinksCreate/#{destination}", '1']
        end

        vb.customize ['setextradata', :id, 'VBoxInternal2/SharedFoldersEnableSymlinksCreate/v-root', '1']
    end

    config.vm.provision :chef_solo do |chef|

        chef.custom_config_path = "Vagrantfile.chef"
        chef.provisioning_path = chef_cache

        chef.cookbooks_path = [
            'chef/chef-cookbooks',
            'chef/site-cookbooks',
        ]

        chef.json = {
            :skeleton => {
                :app_name => 'skeleton',
                :app_user => 'vagrant',
                :db => {
                    :password => 'vagrant'
                },                
                :log_dir => '/vagrant/logs',
                :server_names => [ 'localhost' ],
                :site_dir => '/vagrant',
            },
            :elixir => {
                :version => '1.0.3'
            }
        }

        chef.add_recipe 'vagrant'

        #chef.data_bags_path = 'chef/chef-repo/data_bags'
    end
end
