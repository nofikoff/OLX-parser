--drop database olx
--create database olx

use olx

---------------------------------------------------------
-- Table structure for table `category`

--drop table category;

CREATE TABLE category (
  [ID] int NOT NULL identity(1, 1) primary key,
  [Categ_name] nvarchar(50) NOT NULL,
  [Categ_url] nvarchar(100) NOT NULL,
  CONSTRAINT AK_Categ_url_ID unique ([Categ_url]),
  [Parent] int NOT NULL,
  [Last_update_data] datetime2(0) NOT NULL
);

---------------------------------------------------------
-- Table structure for table `profiles`

--drop table profiles;

CREATE TABLE profiles (
  [ID] int NOT NULL identity(1, 1) primary key,
  [Prof_name] nvarchar(100) NOT NULL,
  [Reg_date] datetime2(0) NOT NULL,  
  [Prof_url] nvarchar(200) NOT NULL,
  CONSTRAINT AK_urlProfID  unique ([Prof_url]),
  [Last_update_data] datetime2(0) NOT NULL,
  [Prof_status] int NOT NULL
);

---------------------------------------------------------
-- Table structure for table `phones`

--drop table phones;

CREATE TABLE phones (
  [ID] int NOT NULL identity(1, 1) primary key,
  [Phone_num] nvarchar(18) NOT NULL,
  [Scan_date] datetime2(0) NOT NULL,
  [Phone_status] binary NOT NULL,
  [Prof_id] int NOT NULL,

  CONSTRAINT FK_phone_id foreign key ([Prof_id]) references profiles ([id])
);

---------------------------------------------------------
-- Table structure for table `tag_group`

--drop table tag_group;

CREATE TABLE tag_group (
  [ID] int NOT NULL identity(1, 1) primary key,
  [Tag_name] nvarchar(100) NOT NULL
);

---------------------------------------------------------
-- Table structure for table `tags`

--drop table tags;

CREATE TABLE tags (
  [ID] int NOT NULL identity(1, 1) primary key,
  [Tag_name] nvarchar(150) NOT NULL,
  [Last_update_data] datetime2(0) NOT NULL,
  [Tag_url] nvarchar(150) NOT NULL,
  [Group_id] int not null

    CONSTRAINT FK_tag_group_id  foreign key ([Group_id]) references tag_group ([ID]),
);

---------------------------------------------------------
-- Table structure for table `urls`

--drop table urls;

CREATE TABLE urls (
  [ID] int NOT NULL identity(1, 1) primary key,
  [Status] binary NOT NULL,
  [Last_update_data] datetime2(0) NOT NULL,
  [Url_name] nvarchar(200) NOT NULL unique
  );

---------------------------------------------------------
-- Table structure for table `ads`

--drop table ads;

CREATE TABLE ads (
  [ID] int NOT NULL identity(1, 1) primary key,
  [Prof_id] int NOT NULL,
  [Categ_id] int NOT NULL,
  [Ad_name] nvarchar(100) NOT NULL,
  [Adress] nvarchar(100) NOT NULL,
  [Price] int NOT NULL,
  [Description] nvarchar(max) NOT NULL,
  [Images] nvarchar(max) NOT NULL,
  [Last_update_data] datetime2(0) NOT NULL,
  [Ad_creation_data] datetime2(0) NOT NULL,
  [Status] binary NOT NULL,
  [Ad_number] int not null,
  [Ad_url_id] int NOT NULL,

  CONSTRAINT FK_categ_id foreign key ([Categ_id]) references category ([id]),
  CONSTRAINT FK_prof_id  foreign key ([Prof_id]) references profiles ([id]),
  CONSTRAINT FK2_ad_url_id  foreign key ([Ad_url_id]) references urls ([id])

);

---------------------------------------------------------
-- Table structure for table `ads2tags`

--drop table ads2tags;

CREATE TABLE ads2tags (
  [Ad_id] int NOT NULL,
  [Tag_id] int NOT NULL

  CONSTRAINT FK_ads_id foreign key ([Ad_id]) references ads ([id]),
  CONSTRAINT FK_tag_id  foreign key ([Tag_id]) references tags ([id])

);
