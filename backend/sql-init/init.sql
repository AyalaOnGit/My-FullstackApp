USE [API_SHOP]
GO
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO

CREATE TABLE [dbo].[Categories](
    [CATEGORY_ID] [int] IDENTITY(1,1) NOT NULL,
    [CATEGORY_NAME] [nvarchar](50) NOT NULL,
    CONSTRAINT [PK_Categories] PRIMARY KEY CLUSTERED ([CATEGORY_ID] ASC)
) ON [PRIMARY]
GO

CREATE TABLE [dbo].[Order_item](
    [ORDER_ITEM_ID] [int] IDENTITY(1,1) NOT NULL,
    [PRODUCT_ID] [int] NOT NULL,
    [ORDER_ID] [int] NOT NULL,
    [QUANTITY] [int] NOT NULL,
    [POPULARCOLORE] [nvarchar](50) NOT NULL,
    [CUSTOMTEXT] [nvarchar](50) NOT NULL,
    CONSTRAINT [PK_Order_item] PRIMARY KEY CLUSTERED ([ORDER_ITEM_ID] ASC)
) ON [PRIMARY]
GO

CREATE TABLE [dbo].[Orders](
    [ORDER_ID] [int] IDENTITY(1,1) NOT NULL,
    [ORDER_DATE] [date] NOT NULL,
    [ORDER_SUM] [float] NULL,
    [USER_ID] [int] NULL,
    [STATUS] [nvarchar](50) NOT NULL,
    CONSTRAINT [PK_Orders] PRIMARY KEY CLUSTERED ([ORDER_ID] ASC)
) ON [PRIMARY]
GO

CREATE TABLE [dbo].[Products](
    [PRODUCT_ID] [int] IDENTITY(1,1) NOT NULL,
    [PRODUCT_NAME] [nvarchar](50) NOT NULL,
    [PRICE] [float] NOT NULL,
    [CATEGORY_ID] [int] NOT NULL,
    [DESCRIPTION] [nvarchar](max) NULL,
    [IMAGE_URL] [varchar](50) NULL,
    [COLORS] [nvarchar](200) NOT NULL,
    [TOPTEXT] [nvarchar](50) NOT NULL,
    CONSTRAINT [PK_Products] PRIMARY KEY CLUSTERED ([PRODUCT_ID] ASC)
) ON [PRIMARY] TEXTIMAGE_ON [PRIMARY]
GO

CREATE TABLE [dbo].[RATING](
    [RATING_ID] [int] IDENTITY(1,1) NOT NULL,
    [HOST] [nvarchar](50) NULL,
    [METHOD] [nchar](10) NULL,
    [PATH] [nvarchar](50) NULL,
    [REFERER] [nvarchar](100) NULL,
    [USER_AGENT] [nvarchar](max) NULL,
    [Record_Date] [datetime] NULL,
    CONSTRAINT [PK_RATING] PRIMARY KEY CLUSTERED ([RATING_ID] ASC)
) ON [PRIMARY] TEXTIMAGE_ON [PRIMARY]
GO

CREATE TABLE [dbo].[User](
    [userId] [int] IDENTITY(1,1) NOT NULL,
    [userEmail] [varchar](50) NOT NULL,
    [userFirstName] [varchar](50) NULL,
    [userLastName] [varchar](50) NULL,
    [userPassword] [varchar](70) NOT NULL,
    [role] [varchar](10) NOT NULL,
    [city] [varchar](50) NULL,
    [address] [varchar](50) NULL,
    [phon] [varchar](10) NULL,
    CONSTRAINT [PK_User] PRIMARY KEY CLUSTERED ([userId] ASC)
) ON [PRIMARY]
GO

ALTER TABLE [dbo].[Order_item] ADD CONSTRAINT [DF_Order_item_CUSTOMTEXT] DEFAULT (' ') FOR [CUSTOMTEXT]
GO
ALTER TABLE [dbo].[Orders] ADD CONSTRAINT [DF_Orders_STATUS] DEFAULT ('באריזה') FOR [STATUS]
GO
ALTER TABLE [dbo].[Products] ADD CONSTRAINT [DF_Products_COLORS] DEFAULT ('[]') FOR [COLORS]
GO
ALTER TABLE [dbo].[Products] ADD CONSTRAINT [DF_Products_TOPTEST] DEFAULT (' ') FOR [TOPTEXT]
GO
ALTER TABLE [dbo].[User] ADD CONSTRAINT [DF_User_role] DEFAULT ('user') FOR [role]
GO
ALTER TABLE [dbo].[Order_item] WITH CHECK ADD CONSTRAINT [FK_Order_item_Orders] FOREIGN KEY([ORDER_ID]) REFERENCES [dbo].[Orders] ([ORDER_ID])
GO
ALTER TABLE [dbo].[Order_item] WITH CHECK ADD CONSTRAINT [FK_Order_item_Products] FOREIGN KEY([PRODUCT_ID]) REFERENCES [dbo].[Products] ([PRODUCT_ID])
GO
ALTER TABLE [dbo].[Orders] WITH CHECK ADD CONSTRAINT [FK_Orders_User] FOREIGN KEY([USER_ID]) REFERENCES [dbo].[User] ([userId])
GO
ALTER TABLE [dbo].[Products] WITH CHECK ADD CONSTRAINT [FK_Products_Categories] FOREIGN KEY([CATEGORY_ID]) REFERENCES [dbo].[Categories] ([CATEGORY_ID])
GO
ALTER TABLE [dbo].[User] WITH CHECK ADD CONSTRAINT [CHK_UserRole] CHECK (([role]='admin' OR [role]='user'))
GO
