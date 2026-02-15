import { withRouter } from "next/router";
import React from "react";
import Cookies from 'js-cookie'
const withAuth = (Component = null, options = {}) => {
    
    class WithAuthComponent extends React.Component {
        state = {
            pageLoading: true,
            redirectIfNotAuthenticated: options.redirectIfAuthenticated ?? "/login",
            redirectIfAuthenticated: options.redirectIfAuthenticated ?? "/",
        };

        componentDidMount() {
            const token = Cookies.get('token');

            const userCookie = Cookies.get('user');
            const user = userCookie ? JSON.parse(userCookie) : null


            // Route is protected but not authenticated. SO redirect to loginpage
            if (options.isProtectedRoute && !token) {
                this.props.router.replace(this.state.redirectIfNotAuthenticated);
                return null;
            }

            // Route is not protected but authenticated. So redirect to Dashboard or provided url
            if (!options.isProtectedRoute && token) {
                this.props.router.replace(this.state.redirectIfAuthenticated);
                return null;
            }

            if(!options.show && user?.status === 'expired' && user?.payment_status === 'unpaid' && token) {
                this.props.router.replace('/subscription');
                return null;
            }

            this.setState({ pageLoading: false });
        }

        render() {
            const { pageLoading } = this.state;

            if (pageLoading) {
                return "";
            }
            return <Component {...this.props} />;
        }
    }

    return withRouter(WithAuthComponent);
};

export default withAuth;