import { createBrowserRouter } from "react-router-dom";
import { Auth } from "../screens/auth/Auth";
import { SignUp } from "../screens/auth/components/SignUp";
import { LogIn } from "../screens/auth/components/LogIn";
import { RecoveryRequest } from "../screens/auth/components/RecoverRequest";
import { RecoveryNotify } from "../screens/auth/components/RecoverNotify";

import { Admin } from "../screens/admin/Admin";
import { Deactive } from "../screens/admin/components/Deactive";
import { AdminHome } from "../screens/admin/components/AdminHome";
import { PostVerification } from "../screens/admin/components/PostVerification";
import { ReportManagement } from "../screens/admin/components/ReportManagement";
import { UserManagement } from "../screens/admin/components/UserManagement";
import { AdminUserProfile } from "../screens/admin/components/AdminUserProfile";
import { AdminPostDetail } from "../screens/admin/components/PostDetail";
import { AdminPostListManagement } from "../screens/admin/components/PostListManagement";

import { UserHome } from "../screens/common/components/Home";
import { PostDetail } from "../screens/common/components/PostDetail";
import { PostListManagement } from "../screens/common/components/PostListManagement";
import { UserEdit } from "../screens/common/components/UserEdit";
import { PostCreate } from "../screens/common/components/PostCreate";
import { Topup } from "../screens/common/components/Topup";
import { PaymentRequest } from "../screens/common/components/PaymentRequest";
import { PaymentHistory } from "../screens/common/components/PaymentHistory";
import Test from "../screens/common/components/Test";
import { PostEdit } from "../screens/common/components/PostEdit";
import { UserDetail } from "../screens/common/components/UserDetail";
import { TransactionManagement } from "../screens/admin/components/TransactionManagement";
import { Order } from "../screens/common/components/PeopleOrder";
import { Request } from "../screens/common/components/MyRequest";
import { SearchSelling } from "../screens/common/components/SellingProduct";
import { SearchDonating } from "../screens/common/components/DonatingProduct";
import { PostPurchasedManagement } from "../screens/common/components/PostPurchased";
import { ExchangeOrderList } from "../screens/admin/components/ExchangeOrderList";
import { ServerDown } from "../screens/common/components/ServerDown";
import { Page404 } from "../screens/common/components/Page404";
import { ChangePass } from "../screens/common/components/ChangePass";

export const appRouter = createBrowserRouter([
    {
        path: '',
        element: <UserHome />
    },
    {
        path: '/test',
        element: <Test />
    },
    {
        path: '/people-order',
        element: <Order />
    },
    {
        path: '/my-request',
        element: <Request />
    },
    {
        path: 'my-purchase',
        element: <PostPurchasedManagement />
    },
    {
        path: 'post-create',
        element: <PostCreate />
    },
    {
        path: 'post-detail',
        element: <PostDetail />
    },
    {
        path: 'post-edit',
        element: <PostEdit />
    },
    {
        path: 'post-list',
        element: <PostListManagement />
    },
    {
        path: 'user-edit',
        element: <UserEdit />
    },
    {
        path: 'user-detail',
        element: <UserDetail />
    },
    {
        path: 'selling',
        element: <SearchSelling />
    },
    {
        path: 'donating',
        element: <SearchDonating />
    },
    {
        path: 'payment-request',
        element: <PaymentRequest />
    },
    {
        path: 'payment-history',
        element: <PaymentHistory />
    },
    {
        path: 'topup',
        element: <Topup />
    },
    {
        path: 'server-down',
        element: <ServerDown />
    },
    {
        path: '*',
        element: <Page404 />
    },
    {
        path: "/auth",
        element: <Auth />,
        children: [
            {
                path: "signup",
                element: <SignUp />
            },
            {
                path: "login",
                element: <LogIn />
            },
            {
                path: "recovery-request",
                element: <RecoveryRequest />
            },
            {
                path: "recovery-notify",
                element: <RecoveryNotify />
            }
        ]
    },
    {
        path: "/admin",
        element: <Admin />,
        children: [
            {
                path: "deactive",
                element: <Deactive />
            },
            {
                path: "dashboard",
                element: <AdminHome />
            },
            {
                path: "post-management",
                element: <AdminPostListManagement />
            },
            {
                path: "post-detail",
                element: <AdminPostDetail />
            },
            {
                path: "post-verify",
                element: <PostVerification />
            },
            {
                path: "report-management",
                element: <ReportManagement />
            },
            {
                path: "user-management",
                element: <UserManagement />
            },
            {
                path: 'transaction-management',
                element: <TransactionManagement />
            },
            {
                path: "user-detail",
                element: <AdminUserProfile />
            },
            {
                path: 'exchange-order',
                element: <ExchangeOrderList />
            }
        ]
    }
])
