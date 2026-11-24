CREATE DATABASE IF NOT EXISTS finance_tracker
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

USE finance_tracker;

CREATE TABLE users (
  id            BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  email         VARCHAR(255) NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  name          VARCHAR(100) NULL,
  currency      CHAR(3) NOT NULL DEFAULT 'USD',
  created_at    TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  UNIQUE KEY uq_users_email (email)
) ENGINE=InnoDB;

CREATE TABLE categories (
  id         BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  user_id    BIGINT UNSIGNED NOT NULL,
  name       VARCHAR(50) NOT NULL,
  type       ENUM('income', 'expense') NOT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  UNIQUE KEY uq_categories_user_name_type (user_id, name, type),
  UNIQUE KEY uq_categories_id_user (id, user_id),
  CONSTRAINT fk_categories_user
    FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE
) ENGINE=InnoDB;

CREATE TABLE transactions (
  id          BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  user_id     BIGINT UNSIGNED NOT NULL,
  category_id BIGINT UNSIGNED NOT NULL,
  type        ENUM('income', 'expense') NOT NULL,
  amount      DECIMAL(12,2) NOT NULL,
  description VARCHAR(255) NULL,
  date        DATE NOT NULL DEFAULT (CURRENT_DATE),
  PRIMARY KEY (id),
  CONSTRAINT chk_transactions_amount CHECK (amount > 0),
  KEY idx_txn_user_date (user_id, date),
  KEY idx_txn_user_cat (user_id, category_id),
  CONSTRAINT fk_txn_user
    FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE,
  CONSTRAINT fk_txn_category_user
    FOREIGN KEY (category_id, user_id)
    REFERENCES categories (id, user_id) ON DELETE RESTRICT
) ENGINE=InnoDB;
