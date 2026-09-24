#import <Cocoa/Cocoa.h>
#import <WebKit/WebKit.h>

@interface SpaceMusicCollegeDelegate : NSObject <NSApplicationDelegate, WKNavigationDelegate>
@property(strong) NSWindow *window;
@property(strong) WKWebView *webView;
@end

@implementation SpaceMusicCollegeDelegate

- (void)applicationDidFinishLaunching:(NSNotification *)notification {
    [NSApp setActivationPolicy:NSApplicationActivationPolicyRegular];
    [self installMenu];

    WKWebViewConfiguration *configuration = [[WKWebViewConfiguration alloc] init];
    configuration.websiteDataStore = WKWebsiteDataStore.defaultDataStore;
    configuration.defaultWebpagePreferences.allowsContentJavaScript = YES;

    self.webView = [[WKWebView alloc] initWithFrame:NSZeroRect configuration:configuration];
    self.webView.navigationDelegate = self;
    self.webView.allowsBackForwardNavigationGestures = YES;
    if (@available(macOS 13.3, *)) self.webView.inspectable = YES;

    NSRect frame = NSScreen.mainScreen ? NSScreen.mainScreen.visibleFrame : NSMakeRect(0, 0, 1280, 820);
    NSWindowStyleMask style = NSWindowStyleMaskTitled | NSWindowStyleMaskClosable |
        NSWindowStyleMaskMiniaturizable | NSWindowStyleMaskResizable | NSWindowStyleMaskFullSizeContentView;
    self.window = [[NSWindow alloc] initWithContentRect:frame styleMask:style backing:NSBackingStoreBuffered defer:NO];
    self.window.title = @"Space Music College";
    self.window.minSize = NSMakeSize(900, 620);
    self.window.contentView = self.webView;
    [self.window setFrame:frame display:YES];
    [self.window makeKeyAndOrderFront:nil];
    [NSApp activateIgnoringOtherApps:YES];

    NSURL *resources = NSBundle.mainBundle.resourceURL;
    NSURL *index = [NSBundle.mainBundle URLForResource:@"index" withExtension:@"html"];
    if (resources && index) {
        [self.webView loadFileURL:index allowingReadAccessToURL:resources];
    } else {
        NSAlert *alert = [[NSAlert alloc] init];
        alert.messageText = @"Space Music College cannot start";
        alert.informativeText = @"The offline game resources are missing from the application bundle.";
        [alert runModal];
        [NSApp terminate:nil];
    }
}

- (BOOL)applicationShouldTerminateAfterLastWindowClosed:(NSApplication *)sender { return YES; }

- (void)installMenu {
    NSMenu *menu = [[NSMenu alloc] init];
    NSMenuItem *appItem = [[NSMenuItem alloc] init];
    [menu addItem:appItem];
    NSMenu *appMenu = [[NSMenu alloc] init];
    [appMenu addItemWithTitle:@"About Space Music College" action:@selector(orderFrontStandardAboutPanel:) keyEquivalent:@""];
    [appMenu addItem:NSMenuItem.separatorItem];
    [appMenu addItemWithTitle:@"Quit Space Music College" action:@selector(terminate:) keyEquivalent:@"q"];
    appItem.submenu = appMenu;
    NSApp.mainMenu = menu;
}

@end

int main(int argc, const char *argv[]) {
    @autoreleasepool {
        NSApplication *application = NSApplication.sharedApplication;
        SpaceMusicCollegeDelegate *delegate = [[SpaceMusicCollegeDelegate alloc] init];
        application.delegate = delegate;
        [application run];
    }
    return 0;
}
