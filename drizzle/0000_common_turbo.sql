CREATE TABLE `challenges` (
	`id` text PRIMARY KEY NOT NULL,
	`answer` text NOT NULL,
	`expires_at` integer NOT NULL,
	`network` text NOT NULL,
	`created_at` integer NOT NULL
);
--> statement-breakpoint
CREATE INDEX `idx_challenges_network_created` ON `challenges` (`network`,`created_at`);--> statement-breakpoint
CREATE TABLE `leads` (
	`id` text PRIMARY KEY NOT NULL,
	`name` text NOT NULL,
	`phone` text NOT NULL,
	`interest` text NOT NULL,
	`visit_date` text NOT NULL,
	`visit_time` text NOT NULL,
	`message` text NOT NULL,
	`status` text DEFAULT 'New' NOT NULL,
	`notes` text DEFAULT '' NOT NULL,
	`assigned_to` text NOT NULL,
	`created_at` integer NOT NULL,
	`updated_at` integer NOT NULL,
	`network` text NOT NULL
);
--> statement-breakpoint
CREATE INDEX `idx_leads_status_created` ON `leads` (`status`,`created_at`);--> statement-breakpoint
CREATE INDEX `idx_leads_network_created` ON `leads` (`network`,`created_at`);--> statement-breakpoint
CREATE TABLE `metrics` (
	`key` text PRIMARY KEY NOT NULL,
	`count` integer DEFAULT 0 NOT NULL
);
--> statement-breakpoint
CREATE TABLE `settings` (
	`key` text PRIMARY KEY NOT NULL,
	`value` text NOT NULL
);
--> statement-breakpoint
CREATE TABLE `staff` (
	`user_id` text PRIMARY KEY NOT NULL,
	`name` text NOT NULL
);
