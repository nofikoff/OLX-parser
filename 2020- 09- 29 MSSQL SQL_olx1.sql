
--drop database olx
-- create database olx

use olx
--drop table category
CREATE TABLE category (
  [id] int NOT NULL identity(1, 1) primary key,
  [name] nvarchar(50) NOT NULL,
  [url] nvarchar(100) NOT NULL,
  CONSTRAINT AK_urlID unique ([url]),
  [parent] int NOT NULL,
  CONSTRAINT AK_ParentID unique ([parent]),

  [date] datetime2(0) NOT NULL
) ;
-- --------------------------------------------------------



--
-- Table structure for table `profiles`
--
--DROP TABLE profiles;

CREATE TABLE profiles (
  [id] int NOT NULL identity(1, 1) primary key,
  [name] nvarchar(100) NOT NULL,
  [date] datetime2(0) NOT NULL,
  
  [url] nvarchar(200) NOT NULL,
  CONSTRAINT AK_urlProfID  unique ([url]),
  

  [status] int NOT NULL,
)	;

--DROP TABLE phones;

CREATE TABLE phones (
  [id] int NOT NULL identity(1, 1) primary key,
  [number] nvarchar(18) NOT NULL,
  [date] datetime2(0) NOT NULL,
  [status] smallint NOT NULL,
  [profile_id] int NOT NULL,

  CONSTRAINT FK_phone_id foreign key ([profile_id]) references profiles ([id])
)  ;

--
-- Table structure for table `tags`
--
--DROP TABLE tags;

CREATE TABLE tags (
  [id] int NOT NULL identity(1, 1) primary key,
  [tag] nvarchar(150) NOT NULL,
  [date] datetime2(0) NOT NULL,
  [urltag] nvarchar(150) NOT NULL
)  ;


--
-- Table structure for table `ads`
--
--
--DROP TABLE ads;

CREATE TABLE ads (
  [id] int NOT NULL identity(1, 1) primary key,
  [profile_id] int NOT NULL,
  [category_id] int NOT NULL,
  [name] nvarchar(100) NOT NULL,
  [adress] nvarchar(100) NOT NULL,
  [price] int NOT NULL,
  [description] nvarchar(max) NOT NULL,
  [images] nvarchar(max) NOT NULL,
  [date] datetime2(0) NOT NULL,
  [status] smallint NOT NULL

  CONSTRAINT FK_categ_id foreign key ([category_id]) references category ([id]),
  CONSTRAINT FK_prof_id  foreign key ([profile_id]) references profiles ([id])
)  ;


--
-- Table structure for table `ads2tags`
--

--DROP TABLE ads2tags;

CREATE TABLE ads2tags (
  [ads_id] int NOT NULL,
  [tag_id] int NOT NULL

  CONSTRAINT FK_ads_id foreign key ([ads_id]) references ads ([id]),
  CONSTRAINT FK_tag_id  foreign key ([tag_id]) references tags ([id])

)  ;


