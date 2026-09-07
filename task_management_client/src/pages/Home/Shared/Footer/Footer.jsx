import {
  Box,
  Globe,
  Share2,
  MessageSquare,
  Heart,
  ArrowUpRight,
} from "lucide-react";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="mt-auto border-t border-indigo-500/20 bg-slate-950/90 backdrop-blur-xl text-slate-400 font-sans">
      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-10">
          {/* Brand & Description */}
          <div className="space-y-4 md:col-span-1">
            <div className="flex items-center gap-3">
              <div className="p-2.5 bg-gradient-to-br from-indigo-600 to-violet-600 rounded-xl shadow-lg shadow-indigo-500/30 text-white ring-1 ring-white/20">
                <Box className="h-5 w-5" />
              </div>
              <span className="text-xl font-bold tracking-tight text-white">
                TaskFlow
              </span>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              আধুনিক ও ডাইনামিক প্রোডাক্ট ম্যানেজমেন্ট সিস্টেম। সহজেই ইনভেন্টরি,
              অর্ডার এবং ব্যবহারকারী পরিচালনা করুন।
            </p>
          </div>

          {/* Quick Links */}
          <div className="space-y-3">
            <h4 className="text-xs font-semibold text-slate-200 uppercase tracking-wider">
              Quick Links
            </h4>
            <ul className="space-y-2 text-xs font-medium">
              <li>
                <a
                  href="/admin/dashboard"
                  className="hover:text-indigo-400 transition-colors flex items-center gap-1 w-fit"
                >
                  Dashboard <ArrowUpRight className="h-3 w-3 opacity-60" />
                </a>
              </li>
              <li>
                <a
                  href="/dashboard/products"
                  className="hover:text-indigo-400 transition-colors flex items-center gap-1 w-fit"
                >
                  Products <ArrowUpRight className="h-3 w-3 opacity-60" />
                </a>
              </li>
              <li>
                <a
                  href="/dashboard/orders"
                  className="hover:text-indigo-400 transition-colors flex items-center gap-1 w-fit"
                >
                  Orders <ArrowUpRight className="h-3 w-3 opacity-60" />
                </a>
              </li>
            </ul>
          </div>

          {/* Management */}
          <div className="space-y-3">
            <h4 className="text-xs font-semibold text-slate-200 uppercase tracking-wider">
              System
            </h4>
            <ul className="space-y-2 text-xs font-medium">
              <li>
                <a
                  href="/dashboard/users-management"
                  className="hover:text-indigo-400 transition-colors"
                >
                  Users Management
                </a>
              </li>
              <li>
                <a
                  href="/dashboard/analytics"
                  className="hover:text-indigo-400 transition-colors"
                >
                  Analytics
                </a>
              </li>
              <li>
                <a
                  href="/dashboard/settings"
                  className="hover:text-indigo-400 transition-colors"
                >
                  Settings
                </a>
              </li>
            </ul>
          </div>

          {/* Social Connections */}
          <div className="space-y-3">
            <h4 className="text-xs font-semibold text-slate-200 uppercase tracking-wider">
              Connect
            </h4>
            <div className="flex items-center gap-3">
              <a
                href="#"
                className="p-2.5 bg-slate-900 border border-indigo-500/20 rounded-xl text-slate-400 hover:text-white hover:border-indigo-500/50 hover:bg-indigo-600/20 transition-all"
              >
                <Globe className="h-4 w-4" />
              </a>
              <a
                href="#"
                className="p-2.5 bg-slate-900 border border-indigo-500/20 rounded-xl text-slate-400 hover:text-white hover:border-indigo-500/50 hover:bg-indigo-600/20 transition-all"
              >
                <Share2 className="h-4 w-4" />
              </a>
              <a
                href="#"
                className="p-2.5 bg-slate-900 border border-indigo-500/20 rounded-xl text-slate-400 hover:text-white hover:border-indigo-500/50 hover:bg-indigo-600/20 transition-all"
              >
                <MessageSquare className="h-4 w-4" />
              </a>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-6 border-t border-indigo-500/10 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs">
          <p>© {currentYear} TaskFlow. All rights reserved.</p>
          <p className="flex items-center gap-1.5 text-slate-400">
            Crafted with{" "}
            <Heart className="h-3.5 w-3.5 text-rose-500 fill-rose-500" /> for
            web application
          </p>
        </div>
      </div>
    </footer>
  );
}
