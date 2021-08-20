"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const intercomVuePlugin = {
    install: (Vue, settings) => {
        const intercom = new Vue({
            data() {
                return {
                    installed: false,
                    ready: false,
                    visible: false,
                    unreadCount: 0,
                };
            },
            methods: {
                loadScript() {
                    const script = document.createElement("script");
                    script.async = true;
                    if (settings && settings.app_id) {
                        script.src = `https://widget.intercom.io/widget/${settings.app_id}`;
                        const firstScript = document.getElementsByTagName("script")[0];
                        if (firstScript.parentNode)
                            firstScript.parentNode.insertBefore(script, firstScript);
                        else
                            throw new Error("Could not add Intercom source code to page");
                        script.onload = () => this.$intercom.init();
                    }
                    else {
                        throw new Error("Missing Intercom app_id");
                    }
                },
                init() {
                    this.callIntercom("onHide", () => (this.$intercom.visible = false));
                    this.callIntercom("onShow", () => (this.$intercom.visible = true));
                    this.callIntercom("onUnreadCountChange", (unreadCount) => (this.unreadCount = unreadCount));
                    window.intercomSettings = { ...settings };
                    this.$intercom.ready = true;
                },
                callIntercom(...args) {
                    window.Intercom(...args);
                },
                isReady() {
                    return new Promise((resolve, reject) => {
                        if (this.$intercom.ready) {
                            resolve(true);
                        }
                        else {
                            setTimeout(async () => {
                                if (this.$intercom.ready) {
                                    resolve(true);
                                }
                                else {
                                    await this.isReady();
                                    resolve(true);
                                }
                            }, 100);
                        }
                    });
                },
                async boot(options) {
                    await this.isReady();
                    if (!options?.app_id && settings) {
                        options.app_id = settings.app_id;
                    }
                    this.callIntercom("boot", options);
                },
                async shutdown() {
                    await this.isReady();
                    this.callIntercom("shutdown");
                },
                async update(options) {
                    await this.isReady();
                    this.callIntercom("update", options);
                },
                async show() {
                    await this.isReady();
                    this.callIntercom("show");
                },
                async onShow(callback) {
                    await this.isReady();
                    this.callIntercom("onShow", callback);
                },
                async hide() {
                    await this.isReady();
                    this.callIntercom("hide");
                },
                async onHide(callback) {
                    await this.isReady();
                    this.callIntercom("onHide", callback);
                },
                async showMessages() {
                    await this.isReady();
                    this.callIntercom("showMessages");
                },
                async showNewMessage(content) {
                    await this.isReady();
                    this.callIntercom("showNewMessage", content ? content : "");
                },
                async trackEvent(name, ...metadata) {
                    await this.isReady();
                    this.callIntercom("trackEvent", ...[name, ...metadata]);
                },
                async getVisitorId() {
                    await this.isReady();
                    this.callIntercom("getVisitorId");
                },
                async startTour(tourId) {
                    await this.isReady();
                    this.callIntercom("startTour", tourId);
                },
            },
        });
        Object.defineProperty(Vue.prototype, "$intercom", {
            get: () => intercom,
        });
        Vue.mixin({
            created() {
                if (!this.$intercom.installed) {
                    const loaded = () => this.$intercom.loadScript();
                    if (document.readyState === "complete") {
                        loaded();
                    }
                    else if (window.attachEvent) {
                        window.attachEvent("onload", loaded);
                    }
                    else {
                        window.addEventListener("load", loaded, false);
                    }
                    this.$intercom.installed = true;
                }
            },
        });
    },
};
exports.default = intercomVuePlugin;
