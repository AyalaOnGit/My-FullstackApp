USE [API_SHOP]
GO

SET IDENTITY_INSERT [dbo].[Categories] ON
INSERT [dbo].[Categories] ([CATEGORY_ID], [CATEGORY_NAME]) VALUES (1, N'לבית ולמטבח')
INSERT [dbo].[Categories] ([CATEGORY_ID], [CATEGORY_NAME]) VALUES (2, N'אירועים ומתנות')
INSERT [dbo].[Categories] ([CATEGORY_ID], [CATEGORY_NAME]) VALUES (3, N'ציוד משרדי')
INSERT [dbo].[Categories] ([CATEGORY_ID], [CATEGORY_NAME]) VALUES (4, N'טקסטיל וביגוד')
INSERT [dbo].[Categories] ([CATEGORY_ID], [CATEGORY_NAME]) VALUES (5, N'אקססוריז')
SET IDENTITY_INSERT [dbo].[Categories] OFF
GO

SET IDENTITY_INSERT [dbo].[User] ON
INSERT [dbo].[User] ([userId], [userEmail], [userFirstName], [userLastName], [userPassword], [role], [city], [address], [phon]) VALUES (1, N'ayal@gmail.com', N'ayal', N'dy', N'$2a$11$CgYgIwUWL81ZCcYbME4P2.BDXTf5p6PXr4STyDDeGbuHNNUWa7Hea', N'user', NULL, NULL, NULL)
INSERT [dbo].[User] ([userId], [userEmail], [userFirstName], [userLastName], [userPassword], [role], [city], [address], [phon]) VALUES (2, N'maya@gmail.com', N'maya', N'ko', N'$2a$11$X2ZMNWqNr0jIkMi3wBJuJ.eE9w2DovXam01u5Gbw5F4ZQyAd4asjG', N'admin', NULL, NULL, NULL)
INSERT [dbo].[User] ([userId], [userEmail], [userFirstName], [userLastName], [userPassword], [role], [city], [address], [phon]) VALUES (3, N'elon@gmail.com', N'elon', N'agam', N'$2a$11$7ZiG/Kd7Mdzd/kBIUWlJsersdyaeU5ymb.IXICwicwZ8waxIS0XAG', N'user', NULL, NULL, NULL)
SET IDENTITY_INSERT [dbo].[User] OFF
GO

SET IDENTITY_INSERT [dbo].[Products] ON
INSERT [dbo].[Products] ([PRODUCT_ID], [PRODUCT_NAME], [PRICE], [CATEGORY_ID], [DESCRIPTION], [IMAGE_URL], [COLORS], [TOPTEXT]) VALUES (12, N'קרש חיתוך מעץ אלון יוקרתי', 149, 1, N'קרש חיתוך עמיד ואיכותי העשוי מעץ אלון מלא...', N'Chopboard.jpg', N'עץ טבעי, אלון כהה, אגוז', N'המטבח של משפחת לוי')
INSERT [dbo].[Products] ([PRODUCT_ID], [PRODUCT_NAME], [PRICE], [CATEGORY_ID], [DESCRIPTION], [IMAGE_URL], [COLORS], [TOPTEXT]) VALUES (13, N'סט תחתיות לכוסות משעם', 45, 1, N'סט של 6 תחתיות טבעיות המונעות סימני רטיבות...', N'cork.jpg', N'חום בהיר, טבעי', N'לחיים!')
INSERT [dbo].[Products] ([PRODUCT_ID], [PRODUCT_NAME], [PRICE], [CATEGORY_ID], [DESCRIPTION], [IMAGE_URL], [COLORS], [TOPTEXT]) VALUES (14, N'ספל מאג קרמי עם כיתוב מוזהב', 39, 1, N'ספל קפה קלאסי בגימור מט...', N'c08e38ff-88f3-4122-93c7-b16526a54a52.jpg', N'לבן, שחור מט, ורוד עתיק', N'בוקר טוב אהובה')
INSERT [dbo].[Products] ([PRODUCT_ID], [PRODUCT_NAME], [PRICE], [CATEGORY_ID], [DESCRIPTION], [IMAGE_URL], [COLORS], [TOPTEXT]) VALUES (15, N'שטיח כניסה לבית בעיצוב אישי', 89, 1, N'שטיח "ברוכים הבאים" עשוי סיבי קוקוס...', N'rug.png', N'חום סיב, בז'' טבעי', N'כאן גרים בכיף')
INSERT [dbo].[Products] ([PRODUCT_ID], [PRODUCT_NAME], [PRICE], [CATEGORY_ID], [DESCRIPTION], [IMAGE_URL], [COLORS], [TOPTEXT]) VALUES (16, N'קופסת עץ ליין עם חריטה', 65, 2, N'קופסת אחסון מהודרת לבקבוק יין...', N'wine.png', N'עץ אורן, מהגוני', N'בציר טוב - 2024')
INSERT [dbo].[Products] ([PRODUCT_ID], [PRODUCT_NAME], [PRICE], [CATEGORY_ID], [DESCRIPTION], [IMAGE_URL], [COLORS], [TOPTEXT]) VALUES (17, N'בלון גז קריסטלי עם כיתוב', 55, 2, N'בלון שקוף וגדול הממולא בקונפטי צבעוני...', N'balloon.jpg', N'שקוף, זהב, כסף, רוז גולד', N'מזל טוב לנסיכה')
INSERT [dbo].[Products] ([PRODUCT_ID], [PRODUCT_NAME], [PRICE], [CATEGORY_ID], [DESCRIPTION], [IMAGE_URL], [COLORS], [TOPTEXT]) VALUES (18, N'פאזל עץ "סיבות למה אני אוהב אותך"', 110, 2, N'פאזל ייחודי שבו על כל חלק נחטרת סיבה...', N'Puzzle.jpg', N'עץ בהיר', N'הסיבות שבלב')
INSERT [dbo].[Products] ([PRODUCT_ID], [PRODUCT_NAME], [PRICE], [CATEGORY_ID], [DESCRIPTION], [IMAGE_URL], [COLORS], [TOPTEXT]) VALUES (19, N'נר ריחני בכלי זכוכית עם הקדשה', 49, 2, N'נר בניחוח וניל או לבנדר...', N'Candle.jpg', N'לבן שמנת, סגול לילך', N'רגע של שלווה')
INSERT [dbo].[Products] ([PRODUCT_ID], [PRODUCT_NAME], [PRICE], [CATEGORY_ID], [DESCRIPTION], [IMAGE_URL], [COLORS], [TOPTEXT]) VALUES (20, N'עט מתכת יוקרתי עם חריטת שם', 79, 3, N'עט נובע או עט כדורי בגימור כרום...', N'pen.jpg', N'שחור, כסף, כחול כהה', N'בהצלחה בדרך החדשה')
INSERT [dbo].[Products] ([PRODUCT_ID], [PRODUCT_NAME], [PRICE], [CATEGORY_ID], [DESCRIPTION], [IMAGE_URL], [COLORS], [TOPTEXT]) VALUES (21, N'מחברת פרימיום עם כריכה קשה', 59, 3, N'מחברת דפים שורות עם כריכת דמוי עור...', N'notebook.jpg', N'חום יוקרתי, שחור, ירוק בקבוק', N'הגיגים ומחשבות')
INSERT [dbo].[Products] ([PRODUCT_ID], [PRODUCT_NAME], [PRICE], [CATEGORY_ID], [DESCRIPTION], [IMAGE_URL], [COLORS], [TOPTEXT]) VALUES (22, N'משטח לעכבר (Mouse Pad) ממותג', 35, 3, N'משטח ארגונומי רך המאפשר עבודה חלקה...', N'Mouse-pad.jpg', N'כחול נייבי, אפור גרפיט', N'עובד מצטיין')
INSERT [dbo].[Products] ([PRODUCT_ID], [PRODUCT_NAME], [PRICE], [CATEGORY_ID], [DESCRIPTION], [IMAGE_URL], [COLORS], [TOPTEXT]) VALUES (23, N'מעמד שולחני לטלפון מעץ', 45, 3, N'סטנד מעוצב לטלפון הנייד המאפשר צפייה נוחה...', N'Stand.jpg', N'עץ טבעי, אפור מודרני', N'תמיד מחובר')
INSERT [dbo].[Products] ([PRODUCT_ID], [PRODUCT_NAME], [PRICE], [CATEGORY_ID], [DESCRIPTION], [IMAGE_URL], [COLORS], [TOPTEXT]) VALUES (24, N'מגבת גוף עם רקמה אישית', 75, 4, N'מגבת רחצה גדולה ומפנקת עשויה 100% כותנה...', N'Towel.jpg', N'לבן, תכלת, ורוד פודרה', N'אחרי המקלחת')
INSERT [dbo].[Products] ([PRODUCT_ID], [PRODUCT_NAME], [PRICE], [CATEGORY_ID], [DESCRIPTION], [IMAGE_URL], [COLORS], [TOPTEXT]) VALUES (25, N'ציפית לכרית עם משפט "לילה טוב"', 40, 4, N'ציפית רכה ונעימה למגע עליה ניתן להדפיס...', N'Towel-robe.jpg', N'לבן, אופ-ווייט', N'חלומות פז')
INSERT [dbo].[Products] ([PRODUCT_ID], [PRODUCT_NAME], [PRICE], [CATEGORY_ID], [DESCRIPTION], [IMAGE_URL], [COLORS], [TOPTEXT]) VALUES (26, N'חלוק רחצה מפנק עם רקמה', 180, 4, N'חלוק מגבת רך וסופג המעניק תחושת ספא...', N'Towel-robe', N'לבן צחור, אפור מלאנג''', N'Spa Time')
INSERT [dbo].[Products] ([PRODUCT_ID], [PRODUCT_NAME], [PRICE], [CATEGORY_ID], [DESCRIPTION], [IMAGE_URL], [COLORS], [TOPTEXT]) VALUES (27, N'סינר מטבח בעיצוב אישי', 65, 4, N'סינר בד עמיד המגן על הבגדים...', N'Apron.jpg', N'שחור, אדום, דנים', N'השף של הבית')
INSERT [dbo].[Products] ([PRODUCT_ID], [PRODUCT_NAME], [PRICE], [CATEGORY_ID], [DESCRIPTION], [IMAGE_URL], [COLORS], [TOPTEXT]) VALUES (28, N'חולצת T-shirt עם כיתוב מקורי', 55, 5, N'חולצת כותנה בגזרה נוחה...', N'shirt.jpg', N'לבן, שחור, אפור', N'הכי מגניב בגן')
INSERT [dbo].[Products] ([PRODUCT_ID], [PRODUCT_NAME], [PRICE], [CATEGORY_ID], [DESCRIPTION], [IMAGE_URL], [COLORS], [TOPTEXT]) VALUES (29, N'כובע מצחייה (Cap) עם רקמה', 50, 5, N'כובע איכותי עם סגירה מתכווננת...', N'hat.png', N'pink', N'Summer Vibes')
INSERT [dbo].[Products] ([PRODUCT_ID], [PRODUCT_NAME], [PRICE], [CATEGORY_ID], [DESCRIPTION], [IMAGE_URL], [COLORS], [TOPTEXT]) VALUES (30, N'ארנק עור עם חריטה פנימית', 130, 5, N'ארנק גברים קלאסי מעור אמיתי...', N'wallet.jpg', N'חום קוניאק, שחור', N'אוהבת תמיד')
INSERT [dbo].[Products] ([PRODUCT_ID], [PRODUCT_NAME], [PRICE], [CATEGORY_ID], [DESCRIPTION], [IMAGE_URL], [COLORS], [TOPTEXT]) VALUES (31, N'תיק בד (Tote Bag) ממותג', 30, 5, N'תיק בד רב-פעמי וידידותי לסביבה...', N'bag.jpg', N'בז'' טבעי, שחור', N'Save the Planet')
INSERT [dbo].[Products] ([PRODUCT_ID], [PRODUCT_NAME], [PRICE], [CATEGORY_ID], [DESCRIPTION], [IMAGE_URL], [COLORS], [TOPTEXT]) VALUES (32, N'סינר שפים', 120, 1, N'כביס', N'b4d1c278-0fe2-4d23-a97a-37701392b651.jpg', N'green,pink', N'באהבה גדולה')
INSERT [dbo].[Products] ([PRODUCT_ID], [PRODUCT_NAME], [PRICE], [CATEGORY_ID], [DESCRIPTION], [IMAGE_URL], [COLORS], [TOPTEXT]) VALUES (33, N'נר מריח מטורף', 20, 2, N'ניחוח של חלום', N'eaa2d966-5845-429d-84c9-d859518cf3d0.jpg', N'white,pink', N'באהבה גדולה')
SET IDENTITY_INSERT [dbo].[Products] OFF
GO

SET IDENTITY_INSERT [dbo].[Orders] ON
INSERT [dbo].[Orders] ([ORDER_ID], [ORDER_DATE], [ORDER_SUM], [USER_ID], [STATUS]) VALUES (5, CAST(N'2026-06-10' AS Date), 212, 1, N'הגיע')
INSERT [dbo].[Orders] ([ORDER_ID], [ORDER_DATE], [ORDER_SUM], [USER_ID], [STATUS]) VALUES (6, CAST(N'2026-06-10' AS Date), 74, 3, N'הגיע')
INSERT [dbo].[Orders] ([ORDER_ID], [ORDER_DATE], [ORDER_SUM], [USER_ID], [STATUS]) VALUES (7, CAST(N'2026-06-10' AS Date), 90, 3, N'הגיע')
INSERT [dbo].[Orders] ([ORDER_ID], [ORDER_DATE], [ORDER_SUM], [USER_ID], [STATUS]) VALUES (8, CAST(N'2026-06-10' AS Date), 128, 3, N'נשלח')
INSERT [dbo].[Orders] ([ORDER_ID], [ORDER_DATE], [ORDER_SUM], [USER_ID], [STATUS]) VALUES (9, CAST(N'2026-06-10' AS Date), 20, 3, N'באריזה')
INSERT [dbo].[Orders] ([ORDER_ID], [ORDER_DATE], [ORDER_SUM], [USER_ID], [STATUS]) VALUES (10, CAST(N'2026-06-11' AS Date), 95, 3, N'באריזה')
INSERT [dbo].[Orders] ([ORDER_ID], [ORDER_DATE], [ORDER_SUM], [USER_ID], [STATUS]) VALUES (17, CAST(N'2026-06-11' AS Date), 55, 3, N'באריזה')
INSERT [dbo].[Orders] ([ORDER_ID], [ORDER_DATE], [ORDER_SUM], [USER_ID], [STATUS]) VALUES (18, CAST(N'2026-06-11' AS Date), 85, 3, N'באריזה')
INSERT [dbo].[Orders] ([ORDER_ID], [ORDER_DATE], [ORDER_SUM], [USER_ID], [STATUS]) VALUES (19, CAST(N'2026-06-11' AS Date), 35, 3, N'באריזה')
INSERT [dbo].[Orders] ([ORDER_ID], [ORDER_DATE], [ORDER_SUM], [USER_ID], [STATUS]) VALUES (20, CAST(N'2026-06-11' AS Date), 75, 3, N'באריזה')
INSERT [dbo].[Orders] ([ORDER_ID], [ORDER_DATE], [ORDER_SUM], [USER_ID], [STATUS]) VALUES (21, CAST(N'2026-06-11' AS Date), 39, 3, N'באריזה')
INSERT [dbo].[Orders] ([ORDER_ID], [ORDER_DATE], [ORDER_SUM], [USER_ID], [STATUS]) VALUES (22, CAST(N'2026-06-11' AS Date), 39, 3, N'באריזה')
INSERT [dbo].[Orders] ([ORDER_ID], [ORDER_DATE], [ORDER_SUM], [USER_ID], [STATUS]) VALUES (23, CAST(N'2026-06-11' AS Date), 45, 3, N'באריזה')
SET IDENTITY_INSERT [dbo].[Orders] OFF
GO

SET IDENTITY_INSERT [dbo].[Order_item] ON
INSERT [dbo].[Order_item] ([ORDER_ITEM_ID], [PRODUCT_ID], [ORDER_ID], [QUANTITY], [POPULARCOLORE], [CUSTOMTEXT]) VALUES (3, 19, 5, 3, N'לבן שמנת', N'אמא הכי בעולם!')
INSERT [dbo].[Order_item] ([ORDER_ITEM_ID], [PRODUCT_ID], [ORDER_ID], [QUANTITY], [POPULARCOLORE], [CUSTOMTEXT]) VALUES (4, 31, 5, 1, N'בז'' טבעי', N'Save the Planet')
INSERT [dbo].[Order_item] ([ORDER_ITEM_ID], [PRODUCT_ID], [ORDER_ID], [QUANTITY], [POPULARCOLORE], [CUSTOMTEXT]) VALUES (5, 22, 5, 1, N'אפור גרפיט', N'לאחותי הכי בעולם')
INSERT [dbo].[Order_item] ([ORDER_ITEM_ID], [PRODUCT_ID], [ORDER_ID], [QUANTITY], [POPULARCOLORE], [CUSTOMTEXT]) VALUES (6, 14, 6, 1, N'לבן', N'בוקר טוב אהובה')
INSERT [dbo].[Order_item] ([ORDER_ITEM_ID], [PRODUCT_ID], [ORDER_ID], [QUANTITY], [POPULARCOLORE], [CUSTOMTEXT]) VALUES (7, 22, 6, 1, N'כחול נייבי', N'תודההה')
INSERT [dbo].[Order_item] ([ORDER_ITEM_ID], [PRODUCT_ID], [ORDER_ID], [QUANTITY], [POPULARCOLORE], [CUSTOMTEXT]) VALUES (8, 25, 7, 1, N'לבן', N'חלומות פז')
INSERT [dbo].[Order_item] ([ORDER_ITEM_ID], [PRODUCT_ID], [ORDER_ID], [QUANTITY], [POPULARCOLORE], [CUSTOMTEXT]) VALUES (9, 29, 7, 1, N'pink', N'חלומיתת')
INSERT [dbo].[Order_item] ([ORDER_ITEM_ID], [PRODUCT_ID], [ORDER_ID], [QUANTITY], [POPULARCOLORE], [CUSTOMTEXT]) VALUES (10, 14, 8, 2, N'לבן', N'היי')
INSERT [dbo].[Order_item] ([ORDER_ITEM_ID], [PRODUCT_ID], [ORDER_ID], [QUANTITY], [POPULARCOLORE], [CUSTOMTEXT]) VALUES (11, 29, 8, 1, N'pink', N'מה?')
INSERT [dbo].[Order_item] ([ORDER_ITEM_ID], [PRODUCT_ID], [ORDER_ID], [QUANTITY], [POPULARCOLORE], [CUSTOMTEXT]) VALUES (12, 33, 9, 1, N'white', N'כמוך....!!')
INSERT [dbo].[Order_item] ([ORDER_ITEM_ID], [PRODUCT_ID], [ORDER_ID], [QUANTITY], [POPULARCOLORE], [CUSTOMTEXT]) VALUES (13, 22, 10, 1, N'כחול נייבי', N'עובד מצטיין')
INSERT [dbo].[Order_item] ([ORDER_ITEM_ID], [PRODUCT_ID], [ORDER_ID], [QUANTITY], [POPULARCOLORE], [CUSTOMTEXT]) VALUES (14, 31, 10, 1, N'בז'' טבעי', N'Save the Planet')
INSERT [dbo].[Order_item] ([ORDER_ITEM_ID], [PRODUCT_ID], [ORDER_ID], [QUANTITY], [POPULARCOLORE], [CUSTOMTEXT]) VALUES (15, 31, 10, 1, N'בז'' טבעי', N'שלום')
INSERT [dbo].[Order_item] ([ORDER_ITEM_ID], [PRODUCT_ID], [ORDER_ID], [QUANTITY], [POPULARCOLORE], [CUSTOMTEXT]) VALUES (22, 28, 17, 1, N'לבן', N'הכי מגניב בגן')
INSERT [dbo].[Order_item] ([ORDER_ITEM_ID], [PRODUCT_ID], [ORDER_ID], [QUANTITY], [POPULARCOLORE], [CUSTOMTEXT]) VALUES (23, 28, 18, 1, N'לבן', N'הכי מגניב בגן')
INSERT [dbo].[Order_item] ([ORDER_ITEM_ID], [PRODUCT_ID], [ORDER_ID], [QUANTITY], [POPULARCOLORE], [CUSTOMTEXT]) VALUES (24, 31, 18, 1, N'בז'' טבעי', N'Save the Planet')
INSERT [dbo].[Order_item] ([ORDER_ITEM_ID], [PRODUCT_ID], [ORDER_ID], [QUANTITY], [POPULARCOLORE], [CUSTOMTEXT]) VALUES (25, 22, 19, 1, N'כחול נייבי', N'לילדה שלי הכי בעולם!')
INSERT [dbo].[Order_item] ([ORDER_ITEM_ID], [PRODUCT_ID], [ORDER_ID], [QUANTITY], [POPULARCOLORE], [CUSTOMTEXT]) VALUES (26, 24, 20, 1, N'תכלת', N'אלון')
INSERT [dbo].[Order_item] ([ORDER_ITEM_ID], [PRODUCT_ID], [ORDER_ID], [QUANTITY], [POPULARCOLORE], [CUSTOMTEXT]) VALUES (27, 14, 21, 1, N'לבן', N'בוקר טוב אהובה')
INSERT [dbo].[Order_item] ([ORDER_ITEM_ID], [PRODUCT_ID], [ORDER_ID], [QUANTITY], [POPULARCOLORE], [CUSTOMTEXT]) VALUES (28, 14, 22, 1, N'שחור מט', N'היי')
INSERT [dbo].[Order_item] ([ORDER_ITEM_ID], [PRODUCT_ID], [ORDER_ID], [QUANTITY], [POPULARCOLORE], [CUSTOMTEXT]) VALUES (29, 13, 23, 1, N'חום בהיר', N'לחיים!')
SET IDENTITY_INSERT [dbo].[Order_item] OFF
GO
