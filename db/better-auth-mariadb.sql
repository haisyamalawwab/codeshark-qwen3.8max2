-- Better Auth schema for MariaDB (Layerbase "Auth Server").
--
-- This is the SQL supplied/generated for Better Auth with the `admin()`
-- plugin, with parentheses normalized so it can be pasted into a MariaDB
-- client. Prefer Layerbase's "Set up the Better Auth schema" button OR
-- `npm run auth:migrate` when a real DATABASE_URL/AUTH_DATABASE_URL is set.
-- Do not invent additional auth tables for this integration.
--
-- Run this against the AUTH database only (never the TiDB/Aiven game DB).

CREATE TABLE `user` (
  `id` varchar(36) NOT NULL,
  `name` text NOT NULL,
  `email` varchar(255) NOT NULL UNIQUE,
  `emailVerified` boolean NOT NULL,
  `image` text,
  `createdAt` datetime NOT NULL DEFAULT (now()),
  `updatedAt` datetime NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
  `role` text,
  `banned` boolean DEFAULT false,
  `banReason` text,
  `banExpires` datetime,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE `session` (
  `id` varchar(36) NOT NULL,
  `expiresAt` datetime NOT NULL,
  `token` varchar(255) NOT NULL UNIQUE,
  `createdAt` datetime NOT NULL DEFAULT (now()),
  `updatedAt` datetime NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
  `ipAddress` text,
  `userAgent` text,
  `userId` varchar(36) NOT NULL,
  `impersonatedBy` text,
  PRIMARY KEY (`id`),
  CONSTRAINT `session_userId_fkey`
    FOREIGN KEY (`userId`) REFERENCES `user` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE `account` (
  `id` varchar(36) NOT NULL,
  `accountId` text NOT NULL,
  `providerId` text NOT NULL,
  `userId` varchar(36) NOT NULL,
  `accessToken` text,
  `refreshToken` text,
  `idToken` text,
  `accessTokenExpiresAt` datetime,
  `refreshTokenExpiresAt` datetime,
  `scope` text,
  `password` text,
  `createdAt` datetime NOT NULL DEFAULT (now()),
  `updatedAt` datetime NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  CONSTRAINT `account_userId_fkey`
    FOREIGN KEY (`userId`) REFERENCES `user` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE `verification` (
  `id` varchar(36) NOT NULL,
  `identifier` text NOT NULL,
  `value` text NOT NULL,
  `expiresAt` datetime NOT NULL,
  `createdAt` datetime NOT NULL DEFAULT (now()),
  `updatedAt` datetime NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE INDEX `session_userId_idx` ON `session` (`userId`);
CREATE INDEX `account_userId_idx` ON `account` (`userId`);
CREATE INDEX `verification_identifier_idx` ON `verification` (`identifier`(191));
