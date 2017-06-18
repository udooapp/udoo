ALTER TABLE `users` ADD `active` INT NOT NULL AFTER `language`;
ALTER TABLE `verification` ADD `type` BOOLEAN NOT NULL AFTER `expirydate`;