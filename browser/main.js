import {
  AuthService,
  Component,
  Router,
  RouterOutlet,
  bootstrapApplication,
  inject,
  provideHttpClient,
  provideRouter,
  setClassMetadata,
  withInterceptors,
  ɵsetClassDebugInfo,
  ɵɵdefineComponent,
  ɵɵelement
} from "./chunk-AK7BGKVV.js";

// src/app/app.component.ts
var AppComponent = class _AppComponent {
  static \u0275fac = function AppComponent_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _AppComponent)();
  };
  static \u0275cmp = /* @__PURE__ */ \u0275\u0275defineComponent({ type: _AppComponent, selectors: [["app-root"]], decls: 1, vars: 0, template: function AppComponent_Template(rf, ctx) {
    if (rf & 1) {
      \u0275\u0275element(0, "router-outlet");
    }
  }, dependencies: [RouterOutlet], encapsulation: 2 });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(AppComponent, [{
    type: Component,
    args: [{
      selector: "app-root",
      standalone: true,
      imports: [RouterOutlet],
      template: `<router-outlet/>`
    }]
  }], null, null);
})();
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && \u0275setClassDebugInfo(AppComponent, { className: "AppComponent", filePath: "src/app/app.component.ts", lineNumber: 10 });
})();

// src/app/core/interceptors/auth.interceptor.ts
var authInterceptor = (req, next) => {
  const token = localStorage.getItem("saylo_token");
  if (token) {
    req = req.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`
      }
    });
  }
  return next(req);
};

// src/app/core/guards/auth.guard.ts
var authGuard = () => {
  const auth = inject(AuthService);
  const router = inject(Router);
  if (auth.isLoggedIn())
    return true;
  router.navigate(["/login"]);
  return false;
};

// src/app/app.routes.ts
var routes = [
  { path: "", redirectTo: "chat", pathMatch: "full" },
  {
    path: "login",
    loadComponent: () => import("./chunk-3VP35TQJ.js").then((m) => m.LoginComponent)
  },
  {
    path: "register",
    loadComponent: () => import("./chunk-IN3U7NIT.js").then((m) => m.RegisterComponent)
  },
  {
    path: "chat",
    loadComponent: () => import("./chunk-7ZRTBBNH.js").then((m) => m.ChatComponent),
    canActivate: [authGuard]
  },
  { path: "**", redirectTo: "chat" }
];

// src/app/app.config.ts
var appConfig = {
  providers: [
    provideRouter(routes),
    provideHttpClient(withInterceptors([authInterceptor]))
  ]
};

// src/main.ts
bootstrapApplication(AppComponent, appConfig).catch((err) => console.error(err));
//# sourceMappingURL=main.js.map
