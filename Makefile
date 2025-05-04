SHELL := /bin/bash

# Terminal colors
GREEN := \033[0;32m
RED := \033[0;31m
NC := \033[0m  # No Color
COMPOSE_DEV=docker compose -f compose.dev.yaml

help: ## Show available commands
	@echo "Available commands:"
	@grep -E '^[a-zA-Z_-]+:.*?##' Makefile | awk 'BEGIN {FS = ":.*?## "}; {printf "  \033[36m%-15s\033[0m %s\n", $$1, $$2}'
	@echo ""
	@echo "  Usage example for passing arguments:"
	@echo "  -  make clean ARGS=\"-a\"  # Pass arguments to commands (e.g., -a for docker system prune)"
	@echo "  -  make dev-up ARGS=\"--build\"  # Example for dev-up with build option"

clean: ## Remove unused docker data
	docker system prune -f $(ARGS)

check-env: ## Ensure ".env" file exists
	@if [ ! -f .env ]; then \
		echo -e "$(RED)❌ \".env\" not found!$(NC)"; \
	else \
		echo -e "$(GREEN)✅ \".env\" already exists!$(NC)"; \
	fi

dev-up: ## Start containers (dev)
	@echo -e "$(GREEN)📦⬆️ Starting containers (dev)...$(NC)"
	$(COMPOSE_DEV) up $(ARGS)

dev-up-and-shell: ## Start containers and open shell (dev)
	@echo -e "$(GREEN)📦⬆️ Starting containers and opening shell (dev)...$(NC)"
	$(COMPOSE_DEV) up -d $(ARGS) && \
		echo "⌛ Waiting for container to be ready..." && \
		until $(COMPOSE_DEV) exec node sh -c "echo 🟢 Container ready"; do sleep 1; done && \
		$(COMPOSE_DEV) exec node sh

dev-down: ## Stop containers (dev)
	@echo -e "$(GREEN)📦⬇️ Stopping containers (dev)...$(NC)"
	$(COMPOSE_DEV) down $(ARGS)
	@echo -e "$(GREEN)✅ Done. Containers are down!$(NC)"

dev-status: ## Show status of containers (dev)
	$(COMPOSE_DEV) ps $(ARGS)

dev-logs: ## Show logs (dev)
	$(COMPOSE_DEV) logs $(ARGS)

dev-config: ## Show config (dev)
	$(COMPOSE_DEV) config $(ARGS)

dev-shell: ## Start shell (dev)
	@echo -e "$(GREEN)📦⬆️ Starting shell (dev)...$(NC)"
	$(COMPOSE_DEV) exec node sh $(ARGS)
