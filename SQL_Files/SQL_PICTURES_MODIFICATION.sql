ALTER TABLE `picturesoffer` CHANGE `scr` `scr` LONGTEXT CHARACTER SET latin1 COLLATE latin1_swedish_ci NULL DEFAULT NULL;

ALTER TABLE `picturesrequest` CHANGE `scr` `scr` LONGTEXT CHARACTER SET latin1 COLLATE latin1_swedish_ci NULL DEFAULT NULL;

ALTER TABLE `picturesrequest` CHANGE `scr` `src` LONGTEXT CHARACTER SET latin1 COLLATE latin1_swedish_ci NULL DEFAULT NULL;

ALTER TABLE `picturesoffer` CHANGE `scr` `src` LONGTEXT CHARACTER SET latin1 COLLATE latin1_swedish_ci NULL DEFAULT NULL;

ALTER TABLE `offer` DROP ` image `;

ALTER TABLE `request` DROP ` image `;

ALTER TABLE `users` ADD `facebookid` BIGINT(11) NOT NULL AFTER `active`;
ALTER TABLE `users` ADD `googleid` VARCHAR(32) NOT NULL AFTER `facebookid`;