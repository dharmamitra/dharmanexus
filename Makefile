COMPOSE := docker compose -f docker-compose.yml
COMPOSEPROD := $(COMPOSE) -f docker-compose.prod.yml

SERVICES := dataloader arangodb fastapi frontend

run-dev:
	$(COMPOSE) down --rmi all frontend
	$(COMPOSE) up $(SERVICES)

run-dev-no-logs:
	$(COMPOSE) up -d $(SERVICES)

run-prod:
	@$(COMPOSEPROD) down --rmi all frontend
	@$(COMPOSEPROD) up $(SERVICES)

run-prod-no-logs:
	@$(COMPOSEPROD) up -d $(SERVICES)

stop:
	docker down

# Display recent logs from all docker containers.
show-logs:
	$(COMPOSE) logs

# Build docker containers again without removing database data
rebuild:
	$(COMPOSE) up --build $(SERVICES)

# Destroy containers and images, including database data
clean-all:
	$(COMPOSE) down --rmi local --volumes

# Clear Redis cache
clear-cache:
	@docker exec -t dharmanexus-redis-1 redis-cli FLUSHALL

# Initialize database and create empty collections
create-db:
	@docker exec -t dataloader bash -c "invoke create-db create-collections"

create-collections:
	@docker exec -t dataloader bash -c "invoke create-collections"

# Load menu collections and categories based on local menu files
load-menu-data:
	@docker exec -t dataloader bash -c "invoke load-metadata"

load-metadata:
	@docker exec -t dataloader bash -c "invoke load-metadata"

add-sources:
	@docker exec -ti dataloader bash -c "invoke add-sources"

clean-db:
	@docker exec -t dataloader bash -c "invoke clean-all-collections"
	@docker exec -t dataloader bash -c "invoke create-db create-collections"

# these commands are for loading individual datasets asynchronously
# @Vladimir this is all you need for now, use 'make run-dev' to start the docker image and then run 'make load-tibetan-data'. If you want to remove data, run 'make clean-db'
load-tibetan-data:
	@docker exec -t dataloader bash -c "invoke create-collections"
	@docker exec -t dataloader bash -c "invoke load-text-segments --lang=bo"
	#@docker exec -t dataloader bash -c "invoke load-parallels --lang=bo"
	@docker exec -t dharmanexus-redis-1 redis-cli FLUSHALL

load-pali-data:
	@docker exec -t dataloader bash -c "invoke create-collections"
	@docker exec -t dataloader bash -c "invoke load-text-segments --lang=pa"
	@docker exec -t dataloader bash -c "invoke load-parallels --lang=pa"
	@docker exec -t dharmanexus-redis-1 redis-cli FLUSHALL

load-chinese-data:
	@docker exec -t dataloader bash -c "invoke create-collections"
	@docker exec -t dataloader bash -c "invoke load-text-segments --lang=zh"
	@docker exec -t dataloader bash -c "invoke load-parallels --lang=zh"
	@docker exec -t dharmanexus-redis-1 redis-cli FLUSHALL

load-sanskrit-data:
	#@docker exec -t dataloader bash -c "invoke create-collections"
	@docker exec -t dataloader bash -c "invoke load-text-segments --lang=sa"
	@docker exec -t dataloader bash -c "invoke load-parallels --lang=sa"
	@docker exec -t dharmanexus-redis-1 redis-cli FLUSHALL

# Load multilingual matches from /matches/multilingual directory
load-multilingual-matches:
	@docker exec -t dataloader bash -c "invoke load-multilingual-matches"
	@docker exec -t dharmanexus-redis-1 redis-cli FLUSHALL

clean-multilingual-matches:
	@docker exec -t dataloader bash -c "invoke clean-multilingual-matches"
	@docker exec -t dharmanexus-redis-1 redis-cli FLUSHALL

clean-tibetan-data:
	@docker exec -t dataloader bash -c "invoke clean-text-segments --lang=bo"
	@docker exec -t dataloader bash -c "invoke clean-parallels --lang=bo"

clean-chinese-data:
	@docker exec -t dataloader bash -c "invoke clean-text-segments --lang=zh"
	@docker exec -t dataloader bash -c "invoke clean-parallels --lang=zh"

clean-pali-data:
	@docker exec -t dataloader bash -c "invoke clean-text-segments --lang=pa"
	@docker exec -t dataloader bash -c "invoke clean-parallels --lang=pa"

clean-sanskrit-data:
	@docker exec -t dataloader bash -c "invoke clean-text-segments --lang=sa"
	@docker exec -t dataloader bash -c "invoke clean-parallels --lang=sa"

clean-all-parallels:
	@docker exec -t dataloader bash -c "invoke clean-all-parallels"
	@docker exec -t dharmanexus-redis-1 redis-cli FLUSHALL

list-tasks:
	@docker exec -t dataloader bash -c "invoke --list"

enter-dataloader:
	@docker exec -ti dataloader bash

enter-api:
	@docker exec -ti fastapi bash

lint-dataloader:
	@docker exec -t dataloader bash -c 'pylint ./*.py'

lint-api:
	@docker exec -t fastapi bash -c 'pylint ./api/*.py'

clean-frontend:
	$(COMPOSEPROD) down --rmi all frontend

run-frontend-dev:
	$(COMPOSE) up frontend

run-frontend:
	$(COMPOSEPROD) up frontend


run-tests:
	$(COMPOSE) run tests pytest -v
