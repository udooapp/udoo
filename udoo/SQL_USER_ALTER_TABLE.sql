ALTER TABLE `users` CHANGE `picture` `picture` LONGTEXT CHARACTER SET utf8 COLLATE utf8_german2_ci NULL DEFAULT NULL;

ALTER TABLE `offer` CHANGE `image` `image` LONGTEXT CHARACTER SET utf8 COLLATE utf8_german2_ci NULL DEFAULT NULL; --New--
ALTER TABLE `request` CHANGE `image` `image` LONGTEXT CHARACTER SET utf8 COLLATE utf8_german2_ci NOT NULL; --New--