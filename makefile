.PHONY: up re reb logs down

up:
	docker-compose up

re:
	docker-compose up --force-recreate -d

reb:
	docker-compose up --force-recreate --build -d

logs:
	docker-compose logs -f -t

down:
	docker-compose down
