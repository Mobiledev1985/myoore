//
//  OoredooWidget.swift
//  OoredooWidget
//
//  Created by Neosoft on 06/07/22.
//

import WidgetKit
import SwiftUI
import Intents


struct Shared:Decodable {
  let w_loginBtnText: String,
      w_shopBtnText: String,
      w_helpText: String,
      w_payText: String,
      w_helloText: String,
      w_welcomeText: String,
      w_layoutDirection: Bool,
      w_login_redirect: String,
      w_shop_redirect : String,
      w_help_redirect : String,
      w_pay_redirect : String
  
}

struct Provider: TimelineProvider {
    func placeholder(in context: Context) -> SimpleEntry {
      SimpleEntry(date: Date(), loginBtnText: "LOGIN", shopBtnText: "Shop",
                  helpText: "Help",
                  payText: "Pay",
                  helloText: "Hello There!",
                  welcomeText: "Welcome",
                  layoutDirection : false,
                  login_redirect : "login",
                  shop_redirect:"shop",
                  help_redirect:"needhelp",
                  pay_redirect :"pay")
    }

    func getSnapshot(in context: Context, completion: @escaping (SimpleEntry) -> ()) {
        let entry = SimpleEntry(date: Date(),loginBtnText: "LOGIN", shopBtnText: "Shop",
                                helpText: "Help",
                                payText: "Pay",
                                helloText: "Hello There!",
                                welcomeText: "Welcome",
                                layoutDirection: false,
                                login_redirect : "login",
                                shop_redirect:"shop",
                                help_redirect:"needhelp",
                                pay_redirect :"pay")
        completion(entry)
    }

    func getTimeline(in context: Context, completion: @escaping (Timeline<Entry>) -> ()) {
      print("getTimeline===")
        var entries: [SimpleEntry] = []
       
      var loginBtnText = ""
      var shopBtnText = ""
      var helpText = ""
      var payText = ""
      var helloText = ""
      var welcomeText = ""
      var layoutDirection = false
      
      var login_redirect = ""
      var shop_redirect = ""
      var help_redirect = ""
      var pay_redirect = ""
      
        let sharedDefaults = UserDefaults.init(suiteName:"group.com.ooredoo.usagepassportwidgets")
          if sharedDefaults != nil {
                do{
                  let shared = sharedDefaults?.string(forKey: "myAppData")
                  if(shared != nil){
                  let data = try JSONDecoder().decode(Shared.self, from: shared!.data(using: .utf8)!)
                  
                    loginBtnText = data.w_loginBtnText
                    shopBtnText = data.w_shopBtnText
                    helpText = data.w_helpText
                    payText = data.w_payText
                    helloText = data.w_helloText
                    welcomeText = data.w_welcomeText
                    layoutDirection = data.w_layoutDirection
                    
                    login_redirect = data.w_login_redirect
                    shop_redirect = data.w_shop_redirect
                    help_redirect = data.w_help_redirect
                    pay_redirect = data.w_pay_redirect
                    
                  }
                }catch{
                  print(error)
                }
          }

        // Generate a timeline consisting of five entries an hour apart, starting from the current date.
        let currentDate = Date()
//        for hourOffset in 0 ..< 5 {
            
      let entryDate = Calendar.current.date(byAdding: .minute, value: 1, to: currentDate)!
      let entry = SimpleEntry(date: entryDate, loginBtnText: loginBtnText, shopBtnText: shopBtnText, helpText: helpText,payText: payText, helloText: helloText, welcomeText:welcomeText, layoutDirection: layoutDirection,  login_redirect: login_redirect,shop_redirect: shop_redirect,help_redirect: help_redirect , pay_redirect: pay_redirect)
          
     

                 
          
            entries.append(entry)
//        }

      let date = Calendar.current.date(byAdding: .minute, value: 1, to: Date())!
      let timeline = Timeline(entries: entries, policy: .after(date))
      
//      let date = Calendar.current.date(byAdding: .minute, value: 1, to: Date())
//      let timeline = Timeline(entries: entries, policy: .after(Date: date))
//        let timeline = Timeline(entries: entries, policy: .atEnd)
        completion(timeline)
    }
}

struct SimpleEntry: TimelineEntry {
    let date: Date
    let loginBtnText: String
    let shopBtnText: String
    let helpText: String
    let payText: String
    let helloText: String
    let welcomeText: String
    let layoutDirection: Bool
    let login_redirect: String
    let shop_redirect : String
    let help_redirect : String
    let pay_redirect : String
  
}

struct OoredooWidgetEntryView : View {
  var entry: Provider.Entry

@Environment(\.widgetFamily) var family //<- here
  

var body: some View {
          
            switch family {
            case .systemSmall:
                Text("Small") //.systemSmall widgets are one large tap area
            default:
              ZStack {
                  Color("WidgetBackground")
                VStack {
              HStack(alignment:.top){
                Image("widget_icon").frame(width: 5, height: 5).padding(EdgeInsets(top: 12, leading: 12, bottom: 0, trailing: 12))
                
                VStack(alignment: .leading){
                  Text(entry.helloText)
//                      .font(.system(size: 13))
                      .fontWeight(.semibold)
//                      .foregroundColor(Color(hex: 0x221E20))
                    
                  Text(entry.welcomeText)
//                    .font(.system(size: 16))
                    .fontWeight(.semibold)
//                    .foregroundColor(Color(hex: 0x221E20))
                }.font(.system(size: 13))
                  .foregroundColor(Color(hex: 0x221E20))
                
                Spacer()
                
                Link(destination: URL(string: entry.login_redirect)!, label: {
                  Text(entry.loginBtnText)
                    .font(.system(size: 13))
                    .fontWeight(.semibold)
                    .foregroundColor(.white)
                    .frame(width: 96, height: 30)
                    .background(Color(hex: 0x1D1D1D))
                    .cornerRadius(15)
                })
                
              }.padding(EdgeInsets(top: 7, leading: 12, bottom: 0, trailing: 12))
              
              Divider().background(Color(hex: 0xF6F6F6))
            
              HStack(alignment:.firstTextBaseline){
                
                Link(destination: URL(string:entry.shop_redirect)!) {
                    VStack(alignment: .center) {
                      Image("widget_shop_icon").frame(width: 5, height: 5).padding(EdgeInsets(top: 12, leading: 0, bottom: 8, trailing: 0))
                          
                        Text(entry.shopBtnText)
                        .font(.system(size: 16))
                        .fontWeight(.medium)
                        .foregroundColor(.white)
                    }
                    .frame(maxWidth: .infinity, maxHeight: UIDevice.current.userInterfaceIdiom == .pad ?  65 : 80)
                    .background(Color(hex: 0xed1c24))
                    .cornerRadius(12)
                    .padding(EdgeInsets(top: 0, leading: 5, bottom: 0, trailing: 5))

                }
                
                Link(destination: URL(string: entry.help_redirect)!) {
                    VStack(alignment: .center) {
                      Image("widget_help_icon").frame(width: 5, height: 5).padding(EdgeInsets(top: 12, leading: 0, bottom: 8, trailing: 0))
                          
                        Text(entry.helpText)
                        .font(.system(size: 16))
                        .fontWeight(.medium)
                        .foregroundColor(.white)
                    }
                    .frame(maxWidth: .infinity, maxHeight: UIDevice.current.userInterfaceIdiom == .pad ?  65 : 80)
                    .background(Color(hex: 0xed1c24))
                    .cornerRadius(12)
                    .padding(EdgeInsets(top: 0, leading: 5, bottom: 0, trailing: 5))

                }
                
                
                Link(destination: URL(string: entry.pay_redirect)!) {
                    VStack(alignment: .center) {
                      Image("widget_pay_icon").frame(width: 5, height: 5).padding(EdgeInsets(top: 12, leading: 0, bottom: 8, trailing: 0))
                          
                        Text(entry.payText)
                        .font(.system(size: 16))
                        .fontWeight(.medium)
                        .foregroundColor(.white)
                    }
                    .frame(maxWidth: .infinity, maxHeight: UIDevice.current.userInterfaceIdiom == .pad ?  65 : 80)
                    .background(Color(hex: 0xed1c24))
                    .cornerRadius(12)
                    .padding(EdgeInsets(top: 0, leading: 5, bottom: 0, trailing: 5))

                }
              }.edgesIgnoringSafeArea(.bottom)
              .padding(EdgeInsets(top: 7, leading: 12, bottom: 12, trailing: 12))
            }
              }.environment(\.layoutDirection, entry.layoutDirection ? .rightToLeft : .leftToRight)
            
            }
}
}

@main
struct OoredooWidget: Widget {
    let kind: String = "OoredooWidget"

    var body: some WidgetConfiguration {
      StaticConfiguration(kind: kind, provider: Provider()) { entry in
        OoredooWidgetEntryView(entry: entry)
      }
        .configurationDisplayName("Ooredoo Kuwait")
        .description("Guest")
        .supportedFamilies([.systemMedium])
    }
}

struct OoredooWidget_Previews: PreviewProvider {
      static var previews: some View {
        OoredooWidgetEntryView(entry: SimpleEntry(date: Date(),loginBtnText: "LOGIN", shopBtnText: "Shop",helpText: "Help",payText: "Pay",helloText: "Hello There!",welcomeText: "Welcome", layoutDirection: false, login_redirect : "login",shop_redirect:"shop",help_redirect:"needhelp",pay_redirect :"pay"))
              .previewContext(WidgetPreviewContext(family: .systemSmall))
      }
}
extension Color {
    init(hex: UInt, alpha: Double = 1) {
        self.init(
            .sRGB,
            red: Double((hex >> 16) & 0xff) / 255,
            green: Double((hex >> 08) & 0xff) / 255,
            blue: Double((hex >> 00) & 0xff) / 255,
            opacity: alpha
        )
    }
}
