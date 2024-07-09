//
//  NotificationService.m
//  NotificationService
//
//  Created by Naresh kolindala on 26/02/19.
//  Copyright © 2019 admin. All rights reserved.
//

#import "NotificationService.h"
//#import <CleverTap-iOS-SDK/CleverTap.h>
//#import <clevertap-react-native/CleverTapReactManager.h>
@interface NotificationService ()

@property (nonatomic, strong) void (^contentHandler)(UNNotificationContent *contentToDeliver);
@property (nonatomic, strong) UNMutableNotificationContent *bestAttemptContent;

@end

@implementation NotificationService

- (void)didReceiveNotificationRequest:(UNNotificationRequest *)request withContentHandler:(void (^)(UNNotificationContent * _Nonnull))contentHandler {
  
//  NSUserDefaults *userdefaults = [[NSUserDefaults standardUserDefaults]initWithSuiteName:@"group.com.wataniya.wataniyakuwait.NotificationService"];
//
//  NSString *email = [userdefaults objectForKey:@"email"];
//  NSString *name = [userdefaults objectForKey:@"name"];
//  NSString *ContractID = [userdefaults objectForKey:@"ContractID"];
//  NSString *mobileNo = [userdefaults objectForKey:@"mobileNo"];
//  NSString *isdigital = [userdefaults objectForKey:@"isdigital"];
//  NSString *rateplantype = [userdefaults objectForKey:@"rateplantype"];
//  NSString *custtype = [userdefaults objectForKey:@"custtype"];
//  NSString *language = [userdefaults objectForKey:@"language"];
//  NSString *voiceline = [userdefaults objectForKey:@"voiceline"];
//    
////      NSDictionary *profile = @{
////          @"email": email,
////      };
//      NSDictionary *profile = @{
//          @"email": email,
//          @"name": name,
//          @"ContractID": ContractID,
//          @"mobileNo": mobileNo,
//          @"isdigital": isdigital,
//          @"rateplantype": rateplantype,
//          @"custtype": custtype,
//          @"language": language,
//          @"voiceline": voiceline,
//      };
////
//  if (ContractID != NULL && ![ContractID  isEqual: @""]) {
//    [[CleverTap sharedInstance] onUserLogin:profile];
//  }
//     
//    [[CleverTap sharedInstance] recordNotificationViewedEventWithData:request.content.userInfo];
  
    self.contentHandler = contentHandler;
    self.bestAttemptContent = [request.content mutableCopy];
    
    // Modify the notification content here...
    //    self.bestAttemptContent.title = [NSString stringWithFormat:@"%@ [modified]", self.bestAttemptContent.title];
    //
    //    self.contentHandler(self.bestAttemptContent);
    
    NSDictionary *userInfo = request.content.userInfo;
    if (userInfo == nil) {
        [self contentComplete];
        return;
    }
    
    NSString *mediaUrl = userInfo[@"mediaUrl"]!=nil?userInfo[@"mediaUrl"]:userInfo[@"ct_mediaUrl"]!=nil?userInfo[@"ct_mediaUrl"]:@"";
    NSString *mediaType = userInfo[@"mediaType"]!=nil?userInfo[@"mediaType"]:userInfo[@"ct_mediaType"]!=nil?userInfo[@"ct_mediaType"]:@"";
    
    if (mediaUrl == nil || mediaType == nil) {
        [self contentComplete];
        return;
    }
    // load the attachment
    [self loadAttachmentForUrlString:mediaUrl
                            withType:mediaType
                   completionHandler:^(UNNotificationAttachment *attachment) {
                       if (attachment) {
                           self.bestAttemptContent.attachments = [NSArray arrayWithObject:attachment];
                       }
                       [self contentComplete];
                   }];
    
}

- (NSString *)fileExtensionForMediaType:(NSString *)type {
    NSString *ext = type;
    
    if ([type isEqualToString:@"image"]) {
        ext = @"jpg";
    }
    
    if ([type isEqualToString:@"video"]) {
        ext = @"mp4";
    }
    if ([type isEqualToString:@"gif"]) {
        return @"gif";
    }
    if ([type isEqualToString:@"audio"]) {
        ext = @"mp3";
    }
    
    return [@"." stringByAppendingString:ext];
}
- (void)loadAttachmentForUrlString:(NSString *)urlString withType:(NSString *)type completionHandler:(void(^)(UNNotificationAttachment *))completionHandler  {
    
    __block UNNotificationAttachment *attachment = nil;
    NSURL *attachmentURL = [NSURL URLWithString:urlString];
    NSString *fileExt = [self fileExtensionForMediaType:type];
    
    NSURLSession *session = [NSURLSession sessionWithConfiguration:[NSURLSessionConfiguration defaultSessionConfiguration]];
    [[session downloadTaskWithURL:attachmentURL
                completionHandler:^(NSURL *temporaryFileLocation, NSURLResponse *response, NSError *error) {
                    if (error != nil) {
                        
                    } else {
                        NSFileManager *fileManager = [NSFileManager defaultManager];
                        NSURL *localURL = [NSURL fileURLWithPath:[temporaryFileLocation.path stringByAppendingString:fileExt]];
                        [fileManager moveItemAtURL:temporaryFileLocation toURL:localURL error:&error];
                        
                        NSError *attachmentError = nil;
                        attachment = [UNNotificationAttachment attachmentWithIdentifier:@"" URL:localURL options:nil error:&attachmentError];
                        if (attachmentError) {
                            
                        }
                    }
                    completionHandler(attachment);
                }] resume];
}

- (void)serviceExtensionTimeWillExpire {
    // Called just before the extension will be terminated by the system.
    // Use this as an opportunity to deliver your "best attempt" at modified content, otherwise the original push payload will be used.
    // self.contentHandler(self.bestAttemptContent);
    [self contentComplete];
}
- (void)contentComplete {
    self.contentHandler(self.bestAttemptContent);
}

@end
