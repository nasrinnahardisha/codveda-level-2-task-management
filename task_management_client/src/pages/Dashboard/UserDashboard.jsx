import React, { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router";
import { Button } from "../../Components/button";
import {
  ShoppingBag,
  Clock,
  CheckCircle,
  Truck,
  XCircle,
  User,
  Phone,
  MapPin,
  Package,
  LogOut,
  ChevronRight,
} from "lucide-react";
import UseAuth from "../../Hooks/UseAuth";
import UseRole from "../../Hooks/UseRole";
import UseAxiosSecure from "../../Hooks/UseAxiosSecure";

const STATUS_COLORS = {
  পেন্ডিং: "bg-yellow-100 text-yellow-700",
  কনফার্মড: "bg-blue-100 text-blue-700",
  শিপিং: "bg-purple-100 text-purple-700",
  ডেলিভার্ড: "bg-green-100 text-green-700",
  ক্যান্সেলড: "bg-red-100 text-red-700",
};

const STATUS_ICONS = {
  পেন্ডিং: Clock,
  কনফার্মড: CheckCircle,
  শিপিং: Truck,
  ডেলিভার্ড: CheckCircle,
  ক্যান্সেলড: XCircle,
};

export default function UserDashboard() {
  const { user, logout, loading } = UseAuth();
  const { role } = UseRole();
  const axiosSecure = UseAxiosSecure();
  const [selectedOrder, setSelectedOrder] = useState(null);

  // Console logs for debugging
  useEffect(() => {
    if (user) {
      console.log("👤 ইউজার ড্যাশবোর্ড লোড হয়েছে");
      console.log("📧 ব্যবহারকারী ইমেইল:", user.email);
      console.log("👨‍💼 ভূমিকা:", role);
    }
  }, [user, role]);

  const { data: orders = [], isLoading } = useQuery({
    queryKey: ["my-orders", user?.email],
    queryFn: async () => {
      try {
        console.log("📡 অর্ডার ফেচ করছি ইমেইল:", user.email);
        const response = await axiosSecure.get(
          `/orders?email=${user.email}`,
        );
        console.log("✓ অর্ডার ডাটা পাওয়া গেছে:", response.data);
        return response.data.data || [];
      } catch (error) {
        console.error("❌ অর্ডার লোডে ত্রুটি:", error);
        return [];
      }
    },
    enabled: !!user?.email,
  });

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        লোড হচ্ছে...
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-muted/30 px-4">
        <div className="bg-card rounded-2xl border shadow-lg p-8 text-center max-w-sm w-full">
          <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
            <User className="w-8 h-8 text-primary" />
          </div>
          <h2 className="text-xl font-bold mb-2">লগইন করুন</h2>
          <p className="text-muted-foreground text-sm mb-6">
            আপনার অর্ডার দেখতে লগইন করুন।
          </p>
          <Link to="/login">
            <Button className="w-full">
              লগইন / রেজিস্ট্রেশন
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  const totalSpent = orders
    .filter((o) => o.status !== "ক্যান্সেলড")
    .reduce((s, o) => s + (o.total_amount || 0), 0);

  const pending = orders.filter(
    (o) =>
      o.status === "পেন্ডিং" || o.status === "কনফার্মড" || o.status === "শিপিং",
  ).length;

  return (
    <div className="min-h-screen bg-muted/30">
      {/* Header */}
      <div className="bg-primary text-primary-foreground py-8 px-4">
        <div className="max-w-3xl mx-auto flex items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-full bg-primary-foreground/20 flex items-center justify-center text-2xl font-bold">
              {user?.full_name?.charAt(0)?.toUpperCase() || "U"}
            </div>
            <div>
              <h1 className="text-xl font-bold">
                {user?.full_name || "ব্যবহারকারী"}
              </h1>
              <p className="text-primary-foreground/70 text-sm">
                {user?.email}
              </p>
            </div>
          </div>
          <Button
            variant="ghost"
            className="text-primary-foreground hover:bg-primary-foreground/10"
            onClick={() => logout()}
          >
            <LogOut className="w-4 h-4 mr-1" /> লগআউট
          </Button>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-4 py-6 space-y-6">
        {/* Stats */}
        <div className="grid grid-cols-3 gap-3">
          <div className="bg-card rounded-2xl border p-4 text-center">
            <p className="text-2xl font-bold text-primary">{orders.length}</p>
            <p className="text-xs text-muted-foreground mt-1">মোট অর্ডার</p>
          </div>
          <div className="bg-card rounded-2xl border p-4 text-center">
            <p className="text-2xl font-bold text-amber-500">{pending}</p>
            <p className="text-xs text-muted-foreground mt-1">চলমান</p>
          </div>
          <div className="bg-card rounded-2xl border p-4 text-center">
            <p className="text-lg font-bold text-green-600">
              ৳{totalSpent.toLocaleString("bn-BD")}
            </p>
            <p className="text-xs text-muted-foreground mt-1">মোট ব্যয়</p>
          </div>
        </div>

        {/* Orders */}
        <div className="bg-card rounded-2xl border">
          <div className="px-5 py-4 border-b">
            <h2 className="font-bold text-lg flex items-center gap-2">
              <ShoppingBag className="w-5 h-5 text-primary" /> আমার অর্ডারসমূহ
            </h2>
          </div>

          {isLoading ? (
            <div className="text-center py-10 text-muted-foreground">
              লোড হচ্ছে...
            </div>
          ) : orders.length === 0 ? (
            <div className="text-center py-12">
              <Package className="w-12 h-12 text-muted-foreground mx-auto mb-3" />
              <p className="text-muted-foreground">এখনো কোনো অর্ডার নেই।</p>
              <Link to="/products">
                <Button className="mt-4" variant="outline">
                  পণ্য দেখুন
                </Button>
              </Link>
            </div>
          ) : (
            <div className="divide-y">
              {orders.map((order) => {
                const StatusIcon = STATUS_ICONS[order.status] || Clock;
                return (
                  <div
                    key={order.id}
                    className="px-5 py-4 hover:bg-muted/30 cursor-pointer transition-colors"
                    onClick={() =>
                      setSelectedOrder(
                        selectedOrder?.id === order.id ? null : order,
                      )
                    }
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div
                          className={`w-9 h-9 rounded-full flex items-center justify-center ${STATUS_COLORS[order.status] || "bg-muted"}`}
                        >
                          <StatusIcon className="w-4 h-4" />
                        </div>
                        <div>
                          <p className="font-medium text-sm">
                            {(order.items || [])
                              .map((i) => i.product_name)
                              .join(", ")}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {new Date(order.created_date).toLocaleDateString(
                              "bn-BD",
                            )}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="text-right">
                          <p className="font-bold text-primary text-sm">
                            ৳{order.total_amount?.toLocaleString("bn-BD")}
                          </p>
                          <span
                            className={`text-xs px-2 py-0.5 rounded-full font-medium ${STATUS_COLORS[order.status] || "bg-muted"}`}
                          >
                            {order.status}
                          </span>
                        </div>
                        <ChevronRight
                          className={`w-4 h-4 text-muted-foreground transition-transform ${selectedOrder?.id === order.id ? "rotate-90" : ""}`}
                        />
                      </div>
                    </div>

                    {/* Expanded detail */}
                    {selectedOrder?.id === order.id && (
                      <div className="mt-4 pt-4 border-t space-y-3 text-sm">
                        {/* Items */}
                        <div className="space-y-1">
                          {(order.items || []).map((item, i) => (
                            <div
                              key={i}
                              className="flex justify-between text-muted-foreground"
                            >
                              <span>
                                {item.product_name} × {item.quantity}
                              </span>
                              <span>
                                ৳
                                {(item.price * item.quantity).toLocaleString(
                                  "bn-BD",
                                )}
                              </span>
                            </div>
                          ))}
                          <div className="flex justify-between font-semibold pt-1 border-t">
                            <span>মোট</span>
                            <span className="text-primary">
                              ৳{order.total_amount?.toLocaleString("bn-BD")}
                            </span>
                          </div>
                        </div>
                        {/* Delivery */}
                        <div className="bg-muted/50 rounded-xl p-3 space-y-1">
                          <p className="flex items-center gap-1.5 text-muted-foreground">
                            <MapPin className="w-3.5 h-3.5" /> {order.address}
                            {order.district && `, ${order.district}`}
                          </p>
                          <p className="flex items-center gap-1.5 text-muted-foreground">
                            <Phone className="w-3.5 h-3.5" />{" "}
                            {order.customer_phone}
                          </p>
                        </div>
                        {/* Note */}
                        {order.note && (
                          <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-3 text-yellow-700 text-xs">
                            <strong>বার্তা:</strong> {order.note}
                          </div>
                        )}
                        {/* Status timeline */}
                        <div>
                          <p className="font-semibold mb-2 text-foreground">
                            ট্র্যাকিং
                          </p>
                          <div className="flex items-center gap-1">
                            {["পেন্ডিং", "কনফার্মড", "শিপিং", "ডেলিভার্ড"].map(
                              (s, i, arr) => {
                                const idx = arr.indexOf(order.status);
                                const done = i <= idx;
                                return (
                                  <React.Fragment key={s}>
                                    <div
                                      className={`flex flex-col items-center`}
                                    >
                                      <div
                                        className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold transition-colors ${done ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"}`}
                                      >
                                        {i + 1}
                                      </div>
                                      <p
                                        className={`text-[10px] mt-1 whitespace-nowrap ${done ? "text-primary font-medium" : "text-muted-foreground"}`}
                                      >
                                        {s}
                                      </p>
                                    </div>
                                    {i < arr.length - 1 && (
                                      <div
                                        className={`flex-1 h-0.5 mb-4 ${i < idx ? "bg-primary" : "bg-muted"}`}
                                      />
                                    )}
                                  </React.Fragment>
                                );
                              },
                            )}
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>

        <div className="text-center">
          <Link to="/products">
            <Button variant="outline" className="rounded-full px-8">
              আরও কেনাকাটা করুন
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
