import { createBrowserRouter } from "react-router-dom";
import { Auth } from "../screens/auth/Auth";
import { SignUp } from "../screens/auth/components/SignUp";
import { SignIn } from "../screens/auth/components/SignIn";
import { RecoveryRequest } from "../screens/auth/components/RecoverRequest";
import { RecoveryNotify } from "../screens/auth/components/RecoverNotify";

import { Admin } from "../screens/admin/Admin";
import { Deactive } from "../screens/admin/components/Deactive";
import { AdminHome } from "../screens/admin/components/AdminHome";
import { PostVerification } from "../screens/admin/components/PostVerification";
import { ReportForm } from "../screens/admin/components/ReportForm";
import { ReportList } from "../screens/admin/components/ReportList";
import { RevenueManagement } from "../screens/admin/components/RevenueManagement";
import { UserManagement } from "../screens/admin/components/UserManagement";
import { AdminUserProfile } from "../screens/admin/components/AdminUserProfile";
import { AdminPostDetail } from "../screens/admin/components/PostDetail";
import { AdminPostListManagement } from "../screens/admin/components/PostListManagement";

import { UserProfile } from "../screens/common/components/UserProfile";
import { UserHome } from "../screens/common/components/Home";
import { PostDetail } from "../screens/common/components/PostDetail";
import { PostListManagement } from "../screens/common/components/PostListManagement";
import { UserEdit } from "../screens/common/components/UserEdit";
import { PostCreate } from "../screens/common/components/PostCreate";
import { Topup } from "../screens/common/components/Topup";
import PaymentRequest from "../screens/common/components/PaymentRequest";
import { ExchangeOrder } from "../screens/common/components/ExchangeOrder";
import { ExchangeRequest } from "../screens/common/components/ExchangeRequest";
import { PaymentHistory } from "../screens/common/components/PaymentHistory";
import { Search } from "../screens/common/components/Search";
import Test from "../screens/common/components/Test";
import { PostEdit } from "../screens/common/components/PostEdit";
import { UserDetail } from "../screens/common/components/UserDetail";
import { Chat } from "../screens/common/components/Chat";


export const appRouter = createBrowserRouter([
    {
        path: '',
        element: <UserHome />
    },
    {
        path: '/test',
        element: <Test />
    },
    // fix element later
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
        path: 'user-profile',
        element: <UserProfile />
    },
    {
        path: 'user-detail',
        element: <UserDetail />
    },
    {
        path: 'search',
        element: <Search />
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
        path: 'exchange-order',
        element: <ExchangeOrder />
    },
    {
        path: 'exchange-request',
        element: <ExchangeRequest />
    },
    {
        path: 'chat',
        element: <Chat />
    },
    {
        path: "/auth",
        element: <Auth />,
        children: [
            {
                path: "register",
                element: <SignUp />
            },
            {
                path: "login",
                element: <SignIn />
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
                path: "admin-home",
                element: <AdminHome />
            },
            {
                path: "post-list",
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
                path: "report",
                element: <ReportForm />
            },
            {
                path: "report-list",
                element: <ReportList />
            },
            {
                path: "revenue",
                element: <RevenueManagement />
            },
            {
                path: "user-management",
                element: <UserManagement />
            },
            {
                path: "user-profile",
                element: <AdminUserProfile />
            },
        ]
    }
])
