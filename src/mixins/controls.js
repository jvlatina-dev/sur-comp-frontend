export default {
  data() {
    return {
      icons: {
        bell: "papsi_bell.svg",
        add: "papsi_add.svg",
        back: "papsi_back.svg",
        next: "papsi_next.svg",
        visible: "papsi_password_visible.svg",
        "visible-white": "papsi_password_visible_white.svg",
        invisible: "papsi_password_invisible.svg",
        check: "papsi_check.svg",
        info: "papsi_info.svg",
        warning: "papsi_warning.svg",
        error: "papsi_error.svg",
        expire: "papsi_expire.svg",
        close: "papsi_close.svg",
        edit: "papsi_edit.svg",
        logout: "papsi_logout.svg",
        qr: "papsi_qr.svg",
        "check-circle": "papsi_check_circle.svg",
        delete: "papsi_delete.svg",
        "delete-white": "papsi_delete_white.svg",
        remove: "papsi_remove.svg",
        down: "papsi_down.svg",
        up: "papsi_up.svg",
        "pin-white": "papsi_pin_white.svg",
        "pin-grey": "papsi_pin_grey.svg",
        user: "papsi_user.svg",
        refresh: "papsi_refresh.svg",
        minimize: "papsi_min.svg",
        expand: "papsi_expand.svg",
        menu: "papsi_menu.svg",
        house: "papsi_home.svg",
        "house-active": "papsi_home_active.svg",
        search: "papsi_search.svg",
        min: "papsi_minimize.svg",
        max: "papsi_maximize.svg",
        restore: "papsi_restore.svg",
        exit: "papsi_exit.svg",
        generate: "papsi_regenerate.svg",
        upload: "papsi_upload.svg",
        more: "papsi_more.svg",
        "see-more": "papsi_seemore.svg",
        "close-green": "papsi_close_green.svg",
        "global-logout": "papsi_global_logout.svg",
        "pso-logout": "papsi_pso_logout.svg",
        "ho-logout": "papsi_ho_logout.svg",
        "edit-green": "papsi_edit_green.svg",
        "send": "papsi_send.svg",
        "records": "papsi_records.svg",

        "ackn": "papsi_ackn.svg",
        "unassign": "papsi_unassign.svg",
        "export": "papsi_export.svg",

        "assign": "papsi_assign.svg",
        "approve": "papsi_approve.svg",
        "disapprove": "papsi_disapprove.svg",
        "pdf": "papsi_pdf.svg",
        "excel": "papsi_excel.svg",
        "post": "papsi_post.svg",

        "up-active": "papsi_up_active.svg",
        "up-inactive": "papsi_up_inactive.svg",
        "up-green": "papsi_up_green.svg",
        "down-active": "papsi_down_active.svg",
        "down-inactive": "papsi_down_inactive.svg",
        "down-green": "papsi_down_green.svg",
        "view": "papsi_view.svg",

        arrow_left: "papsi_arrow_left.svg",
        arrow_right: "papsi_arrow_right.svg",
        first_page: "papsi_first_page.svg",
        last_page: "papsi_last_page.svg",

        employees: "papsi_employees.svg",
        active: "papsi_active.svg",
        online: "papsi_online.svg",
        module: "papsi_module.svg",

        "dashboard-active": "papsi_dashboard_active.svg",
        "dashboard-inactive": "papsi_dashboard_inactive.svg",
        "dashboard-green": "papsi_dashboard_green.svg",
        "billing-active": "papsi_billing_active.svg",
        "billing-inactive": "papsi_billing_inactive.svg",
        "billing-green": "papsi_billing_green.svg",
        "collection-active": "papsi_collection_active.svg",
        "collection-inactive": "papsi_collection_inactive.svg",
        "collection-green": "papsi_collection_green.svg",
        "archive-active": "papsi_archive_active.svg",
        "archive-inactive": "papsi_archive_inactive.svg",
        "archive-green": "papsi_archive_green.svg",
        "file-active": "papsi_file_active.svg",
        "file-inactive": "papsi_file_inactive.svg",
        "file-green": "papsi_file_green.svg",
        "user-active": "papsi_user_active.svg",
        "user-inactive": "papsi_user_inactive.svg",
        "user-green": "papsi_user_green.svg",
        "data-active": "papsi_data_active.svg",
        "data-inactive": "papsi_data_inactive.svg",
        "data-green": "papsi_data_green.svg",
        "module-inactive": "papsi_module_inactive.svg",
        "module-active": "papsi_module_active.svg",
        "module-green": "papsi_module_green.svg",
        "permission-active": "papsi_permission_active.svg",
        "permission-inactive": "papsi_permission_inactive.svg",
        "permission-green": "papsi_permission_green.svg",
        history: "papsi_history.svg",

        user_reset: "papsi_user_reset.svg",
        permission_reset: "papsi_permission_reset.svg",
        pw_reset: "papsi_pw_reset.svg",
        access_reset: "papsi_access_reset.svg",
        user_activate: "papsi_user_activate.svg",
        user_deactivate: "papsi_user_deact.svg",
        pso_deact: "papsi_pso_deact.svg",
        global_shutdown: "papsi_global_shutdown.svg",
        add_user: "papsi_add_user.svg",

        user_info: "papsi_user_info.svg",
        user_edit: "papsi_user_edit.svg",
        permission: "papsi_permission.svg",
        access: "papsi_access.svg",
        reset_pw: "papsi_reset_pw.svg",
        status: "papsi_status.svg",
        assignment: "papsi_assignment.svg",
        inquiries: "papsi_inquiries.svg",
        privilege: "papsi_privilege.svg",
        reset: "papsi_reset.svg",
        logout_user: "papsi_logout_user.svg",


        ledger: "papsi_ledger.svg",
        alarm: "papsi_alarm.svg",
        profile: "papsi_profile.svg",
      },
      images: {
        bcs: "bcs_logo.png",
        papsi: "papsi_logo.png",
        logo: "papsi_icon.png",
        header: "papsi_header.png",
        bell: "papsi_bell.png",
        box: "papsi_box.png",
      },
    };
  },

  methods: {
    getIcon(id) {
      if (!this.icons[id]) {
        if (id != "") {
          // console.error(`Icon: "${id}" does not exist.`);
        }
      }
      return require(`@/assets/icons/${this.icons[id]}`);
    },
    getImage(id) {
      if (!id) return "";

      if (!this.images[id]) {
        return `./assets/images/${id}`;
      }

      return `./assets/images/${this.images[id]}`;
    },
    getVideo(id) {
      if (!id) return "";
      // For videos, it’s better to put them in `public/assets/videos` to avoid bundling large files
      return `./assets/videos/${id}`;
    },
    goBack() {
      this.$router.back();
    },
    refresh() {
      window.location.reload();
    },
    goToHome() {
      const userType = sessionStorage.getItem("user_type");

      if (userType === "S") {
        this.$router.push("/admin-dashboard");
      } else {
        this.$router.push("/dashboard");
      }
    },
    defaultStore() {
      const state = this.$store.state;

      state.branch = null;
      state.login = {
        user_type: null,
        username: null,
        credentials: {},
      };
    },
    handleRedirect(redirect_to) {
      if (redirect_to) {
        this.$router.push(redirect_to);
      }
    },
    saveSystemCookie() {
      if (this.$cookies.isKey("system_hash")) {
        this.$cookies.remove("system_hash");
      }
    },
    clearSystemCookie() {
      if (this.$cookies.isKey("system_hash")) {
        this.$cookies.remove("system_hash");
      }
    },
    getBranchServiceDesc(key) {
      if (!key) return "";
      const list = this.$store.state.br_svc;
      if (!Array.isArray(list)) return "";
      const result = list.find((item) => item.value === key);
      return result ? result.label : "";
    },
    getMemberType(key) {
      if (!key) return "";
      const list = this.$store.state.memb;
      if (!Array.isArray(list)) return "";
      const result = list.find((item) => item.value === key);
      return result ? result.label : "";
    },
    getMemberTypeView(key) {
      if (!key) return "";
      const list = this.$store.state.memb_view;
      if (!Array.isArray(list)) return "";
      const result = list.find((item) => item.value === key);
      return result ? result.label : "";
    },
  },
};
