import {
  DefaultValueAccessor,
  FormsModule,
  NgControlStatus,
  NgModel
} from "./chunk-C45OCT45.js";
import {
  AuthService,
  CommonModule,
  Component,
  Router,
  RouterLink,
  setClassMetadata,
  signal,
  ɵsetClassDebugInfo,
  ɵɵadvance,
  ɵɵclassProp,
  ɵɵconditional,
  ɵɵconditionalCreate,
  ɵɵdefineComponent,
  ɵɵdirectiveInject,
  ɵɵelement,
  ɵɵelementEnd,
  ɵɵelementStart,
  ɵɵlistener,
  ɵɵnextContext,
  ɵɵproperty,
  ɵɵtext,
  ɵɵtextInterpolate,
  ɵɵtwoWayBindingSet,
  ɵɵtwoWayListener,
  ɵɵtwoWayProperty
} from "./chunk-AK7BGKVV.js";

// src/app/features/auth/login.component.ts
function LoginComponent_Conditional_8_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 5);
    \u0275\u0275text(1);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const ctx_r0 = \u0275\u0275nextContext();
    \u0275\u0275advance();
    \u0275\u0275textInterpolate(ctx_r0.error());
  }
}
function LoginComponent_Conditional_19_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275element(0, "span", 11);
  }
}
function LoginComponent_Conditional_20_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275text(0, " Sign In ");
  }
}
var LoginComponent = class _LoginComponent {
  auth;
  router;
  email = "";
  password = "";
  loading = signal(false, ...ngDevMode ? [{ debugName: "loading" }] : []);
  error = signal("", ...ngDevMode ? [{ debugName: "error" }] : []);
  constructor(auth, router) {
    this.auth = auth;
    this.router = router;
  }
  login() {
    if (!this.email || !this.password) {
      this.error.set("Please fill all fields");
      return;
    }
    this.loading.set(true);
    this.error.set("");
    this.auth.login({ email: this.email, password: this.password }).subscribe({
      next: () => {
        this.loading.set(false);
        this.router.navigate(["/chat"]);
      },
      error: (e) => {
        this.error.set(e.error?.message || "Login failed");
        this.loading.set(false);
      }
    });
  }
  static \u0275fac = function LoginComponent_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _LoginComponent)(\u0275\u0275directiveInject(AuthService), \u0275\u0275directiveInject(Router));
  };
  static \u0275cmp = /* @__PURE__ */ \u0275\u0275defineComponent({ type: _LoginComponent, selectors: [["app-login"]], decls: 25, vars: 7, consts: [[1, "auth-shell"], [1, "auth-card"], [1, "auth-logo"], [1, "auth-title"], [1, "auth-sub"], [1, "auth-error"], [1, "auth-form"], [1, "field"], ["type", "email", "placeholder", "you@example.com", 3, "ngModelChange", "keydown.enter", "ngModel"], ["type", "password", "placeholder", "\u2022\u2022\u2022\u2022\u2022\u2022\u2022\u2022", 3, "ngModelChange", "keydown.enter", "ngModel"], [1, "auth-btn", 3, "click", "disabled"], [1, "spinner"], [1, "auth-link"], ["routerLink", "/register"]], template: function LoginComponent_Template(rf, ctx) {
    if (rf & 1) {
      \u0275\u0275elementStart(0, "div", 0)(1, "div", 1)(2, "div", 2);
      \u0275\u0275text(3, "S");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(4, "h1", 3);
      \u0275\u0275text(5, "Welcome back");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(6, "p", 4);
      \u0275\u0275text(7, "Sign in to Saylo");
      \u0275\u0275elementEnd();
      \u0275\u0275conditionalCreate(8, LoginComponent_Conditional_8_Template, 2, 1, "div", 5);
      \u0275\u0275elementStart(9, "div", 6)(10, "div", 7)(11, "label");
      \u0275\u0275text(12, "Email");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(13, "input", 8);
      \u0275\u0275twoWayListener("ngModelChange", function LoginComponent_Template_input_ngModelChange_13_listener($event) {
        \u0275\u0275twoWayBindingSet(ctx.email, $event) || (ctx.email = $event);
        return $event;
      });
      \u0275\u0275listener("keydown.enter", function LoginComponent_Template_input_keydown_enter_13_listener() {
        return ctx.login();
      });
      \u0275\u0275elementEnd()();
      \u0275\u0275elementStart(14, "div", 7)(15, "label");
      \u0275\u0275text(16, "Password");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(17, "input", 9);
      \u0275\u0275twoWayListener("ngModelChange", function LoginComponent_Template_input_ngModelChange_17_listener($event) {
        \u0275\u0275twoWayBindingSet(ctx.password, $event) || (ctx.password = $event);
        return $event;
      });
      \u0275\u0275listener("keydown.enter", function LoginComponent_Template_input_keydown_enter_17_listener() {
        return ctx.login();
      });
      \u0275\u0275elementEnd()();
      \u0275\u0275elementStart(18, "button", 10);
      \u0275\u0275listener("click", function LoginComponent_Template_button_click_18_listener() {
        return ctx.login();
      });
      \u0275\u0275conditionalCreate(19, LoginComponent_Conditional_19_Template, 1, 0, "span", 11)(20, LoginComponent_Conditional_20_Template, 1, 0);
      \u0275\u0275elementEnd()();
      \u0275\u0275elementStart(21, "p", 12);
      \u0275\u0275text(22, "No account? ");
      \u0275\u0275elementStart(23, "a", 13);
      \u0275\u0275text(24, "Create one");
      \u0275\u0275elementEnd()()()();
    }
    if (rf & 2) {
      \u0275\u0275advance(8);
      \u0275\u0275conditional(ctx.error() ? 8 : -1);
      \u0275\u0275advance(5);
      \u0275\u0275twoWayProperty("ngModel", ctx.email);
      \u0275\u0275advance(4);
      \u0275\u0275twoWayProperty("ngModel", ctx.password);
      \u0275\u0275advance();
      \u0275\u0275classProp("loading", ctx.loading());
      \u0275\u0275property("disabled", ctx.loading());
      \u0275\u0275advance();
      \u0275\u0275conditional(ctx.loading() ? 19 : 20);
    }
  }, dependencies: [CommonModule, FormsModule, DefaultValueAccessor, NgControlStatus, NgModel, RouterLink], styles: ['\n\n.auth-shell[_ngcontent-%COMP%] {\n  min-height: 100vh;\n  display: flex;\n  align-items: center;\n  justify-content: center;\n  background:\n    linear-gradient(\n      135deg,\n      #f8f4f0 0%,\n      #ede8ff 100%);\n  padding: 20px;\n  font-family: "Plus Jakarta Sans", sans-serif;\n}\n.auth-card[_ngcontent-%COMP%] {\n  background: #fff;\n  border-radius: 24px;\n  padding: 40px;\n  width: 100%;\n  max-width: 400px;\n  box-shadow: 0 8px 40px rgba(0, 0, 0, 0.1);\n  text-align: center;\n}\n.auth-logo[_ngcontent-%COMP%] {\n  width: 56px;\n  height: 56px;\n  background:\n    linear-gradient(\n      135deg,\n      #6C63FF,\n      #F5A623);\n  border-radius: 16px;\n  display: flex;\n  align-items: center;\n  justify-content: center;\n  font-size: 24px;\n  font-weight: 800;\n  color: #fff;\n  margin: 0 auto 20px;\n  box-shadow: 0 4px 16px rgba(108, 99, 255, 0.3);\n}\n.auth-title[_ngcontent-%COMP%] {\n  font-size: 26px;\n  font-weight: 800;\n  color: #1a1410;\n  margin: 0 0 6px;\n}\n.auth-sub[_ngcontent-%COMP%] {\n  color: #9c8f85;\n  font-size: 14px;\n  margin: 0 0 28px;\n}\n.auth-error[_ngcontent-%COMP%] {\n  background: #fff0f0;\n  border: 1px solid #fcc;\n  border-radius: 10px;\n  padding: 10px 14px;\n  color: #e53;\n  font-size: 13px;\n  margin-bottom: 16px;\n}\n.auth-form[_ngcontent-%COMP%] {\n  text-align: left;\n  display: flex;\n  flex-direction: column;\n  gap: 16px;\n}\n.field[_ngcontent-%COMP%]   label[_ngcontent-%COMP%] {\n  display: block;\n  font-size: 13px;\n  font-weight: 600;\n  color: #4a3f35;\n  margin-bottom: 6px;\n}\n.field[_ngcontent-%COMP%]   input[_ngcontent-%COMP%] {\n  width: 100%;\n  padding: 12px 14px;\n  border: 1.5px solid #e8e1d9;\n  border-radius: 12px;\n  font-size: 15px;\n  color: #1a1410;\n  transition: border-color 0.15s;\n  outline: none;\n  box-sizing: border-box;\n}\n.field[_ngcontent-%COMP%]   input[_ngcontent-%COMP%]:focus {\n  border-color: #6C63FF;\n}\n.auth-btn[_ngcontent-%COMP%] {\n  width: 100%;\n  padding: 14px;\n  background:\n    linear-gradient(\n      135deg,\n      #6C63FF,\n      #F5A623);\n  color: #fff;\n  border: none;\n  border-radius: 14px;\n  font-size: 15px;\n  font-weight: 700;\n  cursor: pointer;\n  transition: all 0.2s;\n  margin-top: 4px;\n  display: flex;\n  align-items: center;\n  justify-content: center;\n  gap: 8px;\n  min-height: 50px;\n}\n.auth-btn[_ngcontent-%COMP%]:hover:not(:disabled) {\n  transform: translateY(-1px);\n  box-shadow: 0 6px 20px rgba(108, 99, 255, 0.35);\n}\n.auth-btn[_ngcontent-%COMP%]:disabled {\n  opacity: 0.7;\n  cursor: not-allowed;\n}\n.spinner[_ngcontent-%COMP%] {\n  width: 18px;\n  height: 18px;\n  border: 2.5px solid rgba(255, 255, 255, 0.4);\n  border-top-color: #fff;\n  border-radius: 50%;\n  animation: _ngcontent-%COMP%_spin 0.7s linear infinite;\n}\n@keyframes _ngcontent-%COMP%_spin {\n  to {\n    transform: rotate(360deg);\n  }\n}\n.auth-link[_ngcontent-%COMP%] {\n  margin-top: 20px;\n  color: #9c8f85;\n  font-size: 14px;\n}\n.auth-link[_ngcontent-%COMP%]   a[_ngcontent-%COMP%] {\n  color: #6C63FF;\n  font-weight: 600;\n  text-decoration: none;\n}\n@media (max-width: 480px) {\n  .auth-card[_ngcontent-%COMP%] {\n    padding: 28px 20px;\n  }\n}\n/*# sourceMappingURL=login.component.css.map */'] });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(LoginComponent, [{
    type: Component,
    args: [{ selector: "app-login", standalone: true, imports: [CommonModule, FormsModule, RouterLink], template: `
<div class="auth-shell">
  <div class="auth-card">
    <div class="auth-logo">S</div>
    <h1 class="auth-title">Welcome back</h1>
    <p class="auth-sub">Sign in to Saylo</p>

    @if(error()){
      <div class="auth-error">{{error()}}</div>
    }

    <div class="auth-form">
      <div class="field">
        <label>Email</label>
        <input type="email" [(ngModel)]="email" placeholder="you@example.com" (keydown.enter)="login()">
      </div>
      <div class="field">
        <label>Password</label>
        <input type="password" [(ngModel)]="password" placeholder="\u2022\u2022\u2022\u2022\u2022\u2022\u2022\u2022" (keydown.enter)="login()">
      </div>
      <button class="auth-btn" [class.loading]="loading()" (click)="login()" [disabled]="loading()">
        @if(loading()){ <span class="spinner"></span> } @else { Sign In }
      </button>
    </div>

    <p class="auth-link">No account? <a routerLink="/register">Create one</a></p>
  </div>
</div>
  `, styles: ['/* angular:styles/component:scss;a8706022ab46378451d4e79e5f69a8e87579c09eedf7caa9371f0a496840c397;C:/js_projects/saylo-v2/frontend/src/app/features/auth/login.component.ts */\n.auth-shell {\n  min-height: 100vh;\n  display: flex;\n  align-items: center;\n  justify-content: center;\n  background:\n    linear-gradient(\n      135deg,\n      #f8f4f0 0%,\n      #ede8ff 100%);\n  padding: 20px;\n  font-family: "Plus Jakarta Sans", sans-serif;\n}\n.auth-card {\n  background: #fff;\n  border-radius: 24px;\n  padding: 40px;\n  width: 100%;\n  max-width: 400px;\n  box-shadow: 0 8px 40px rgba(0, 0, 0, 0.1);\n  text-align: center;\n}\n.auth-logo {\n  width: 56px;\n  height: 56px;\n  background:\n    linear-gradient(\n      135deg,\n      #6C63FF,\n      #F5A623);\n  border-radius: 16px;\n  display: flex;\n  align-items: center;\n  justify-content: center;\n  font-size: 24px;\n  font-weight: 800;\n  color: #fff;\n  margin: 0 auto 20px;\n  box-shadow: 0 4px 16px rgba(108, 99, 255, 0.3);\n}\n.auth-title {\n  font-size: 26px;\n  font-weight: 800;\n  color: #1a1410;\n  margin: 0 0 6px;\n}\n.auth-sub {\n  color: #9c8f85;\n  font-size: 14px;\n  margin: 0 0 28px;\n}\n.auth-error {\n  background: #fff0f0;\n  border: 1px solid #fcc;\n  border-radius: 10px;\n  padding: 10px 14px;\n  color: #e53;\n  font-size: 13px;\n  margin-bottom: 16px;\n}\n.auth-form {\n  text-align: left;\n  display: flex;\n  flex-direction: column;\n  gap: 16px;\n}\n.field label {\n  display: block;\n  font-size: 13px;\n  font-weight: 600;\n  color: #4a3f35;\n  margin-bottom: 6px;\n}\n.field input {\n  width: 100%;\n  padding: 12px 14px;\n  border: 1.5px solid #e8e1d9;\n  border-radius: 12px;\n  font-size: 15px;\n  color: #1a1410;\n  transition: border-color 0.15s;\n  outline: none;\n  box-sizing: border-box;\n}\n.field input:focus {\n  border-color: #6C63FF;\n}\n.auth-btn {\n  width: 100%;\n  padding: 14px;\n  background:\n    linear-gradient(\n      135deg,\n      #6C63FF,\n      #F5A623);\n  color: #fff;\n  border: none;\n  border-radius: 14px;\n  font-size: 15px;\n  font-weight: 700;\n  cursor: pointer;\n  transition: all 0.2s;\n  margin-top: 4px;\n  display: flex;\n  align-items: center;\n  justify-content: center;\n  gap: 8px;\n  min-height: 50px;\n}\n.auth-btn:hover:not(:disabled) {\n  transform: translateY(-1px);\n  box-shadow: 0 6px 20px rgba(108, 99, 255, 0.35);\n}\n.auth-btn:disabled {\n  opacity: 0.7;\n  cursor: not-allowed;\n}\n.spinner {\n  width: 18px;\n  height: 18px;\n  border: 2.5px solid rgba(255, 255, 255, 0.4);\n  border-top-color: #fff;\n  border-radius: 50%;\n  animation: spin 0.7s linear infinite;\n}\n@keyframes spin {\n  to {\n    transform: rotate(360deg);\n  }\n}\n.auth-link {\n  margin-top: 20px;\n  color: #9c8f85;\n  font-size: 14px;\n}\n.auth-link a {\n  color: #6C63FF;\n  font-weight: 600;\n  text-decoration: none;\n}\n@media (max-width: 480px) {\n  .auth-card {\n    padding: 28px 20px;\n  }\n}\n/*# sourceMappingURL=login.component.css.map */\n'] }]
  }], () => [{ type: AuthService }, { type: Router }], null);
})();
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && \u0275setClassDebugInfo(LoginComponent, { className: "LoginComponent", filePath: "src/app/features/auth/login.component.ts", lineNumber: 100 });
})();
export {
  LoginComponent
};
//# sourceMappingURL=chunk-3VP35TQJ.js.map
