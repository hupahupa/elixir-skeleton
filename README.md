INSTALLATION
====================

1.  git clone git@github.com:hupahupa/elixir-skeleton.git --recursive => clone project
2.  cd elixir-skeleton => change to elixir-skeleton folder
3.  vagrant up => run the vagrant
4.  browse at: localhost:9500

Working Tips
====================
* Access Postgresql:
	+ . /vagrant/scripts/set_env.sh (this also Active virtual environment)
	+ psql
* Restart server:
	+ ./vagrant/scripts/restart.sh
* Dev mode debuging:
	+ ./vagrant/scripts/restart.sh
	+ tail -f /vagrant/logs/app.log => see the log
* Work with migration
    - Run migration:
```
    . /vagrant/scripts/set_env.sh
    cd /vagrant/schema
    python update.py commit
```
    - Create migration:

    1. Step1: Create sql in an exist or new yaml file (schema/migrations/table_name.yaml:

```
---
table: tbl_user
from: null
to: lmd_1
sql: |
  CREATE TYPE USER_STATUS_ENUM AS ENUM ('pending', 'active');
  CREATE TABLE tbl_user (
    id SERIAL NOT NULL PRIMARY KEY,
    full_name TEXT,
    fb_id TEXT,
    email TEXT,
    password TEXT,
    phone_code TEXT,
    phone_number TEXT,
    secret_token TEXT,
    status USER_STATUS_ENUM DEFAULT 'pending',
    created_at TIMESTAMP WITHOUT TIME ZONE DEFAULT NOW(),
    UNIQUE(fb_id),
    UNIQUE(secret_token),
    UNIQUE(email)
  );
```

    2. Step2: Update version of that table in protected/schema/versions.json

```
        {
          "tbl_user": "lmd_1"
        }
```

    3. Run migration (see above)

Reference Packages
====================
*	ELixir: http://elixir-lang.org/getting-started/introduction.html
*	PhoenixFramework: http://www.phoenixframework.org/