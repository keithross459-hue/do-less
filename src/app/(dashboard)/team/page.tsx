import { Users, UserPlus, Shield, MoreVertical, Mail, LayoutGrid } from "lucide-react";
import prisma from "@/lib/prisma";

export const dynamic = "force-dynamic";

export default async function TeamPage() {
  const workspace = await prisma.workspace.findFirst({
    include: {
      members: {
        include: {
          user: true
        }
      }
    }
  });

  if (!workspace) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <Users className="w-16 h-16 text-zinc-700 mb-4" />
        <h2 className="text-xl font-display font-bold text-white">No Workspace Found</h2>
        <p className="text-zinc-500 max-w-sm mt-2">Create a workspace to start collaborating with your team.</p>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-display font-bold text-white flex items-center gap-3">
            <Users className="w-8 h-8 text-secondary" />
            Team Management
          </h1>
          <p className="text-zinc-400 mt-1">Manage members and permissions for <span className="text-white font-medium">{workspace.name}</span>.</p>
        </div>
        <button className="px-5 py-2.5 bg-secondary text-white rounded-xl font-bold hover:bg-secondary/90 transition-all flex items-center gap-2 shadow-[0_0_20px_rgba(112,0,255,0.3)]">
          <UserPlus className="w-4 h-4" />
          Invite Member
        </button>
      </div>

      {/* Workspace Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="glass-panel p-6 flex items-center gap-4">
          <div className="p-3 rounded-xl bg-secondary/10 border border-secondary/20">
            <Users className="w-6 h-6 text-secondary" />
          </div>
          <div>
            <p className="text-xs text-zinc-500 uppercase tracking-widest font-bold">Total Members</p>
            <p className="text-2xl font-display font-bold text-white">{workspace.members.length}</p>
          </div>
        </div>
        <div className="glass-panel p-6 flex items-center gap-4">
          <div className="p-3 rounded-xl bg-primary/10 border border-primary/20">
            <LayoutGrid className="w-6 h-6 text-primary" />
          </div>
          <div>
            <p className="text-xs text-zinc-500 uppercase tracking-widest font-bold">Shared Resources</p>
            <p className="text-2xl font-display font-bold text-white">12 Agents</p>
          </div>
        </div>
        <div className="glass-panel p-6 flex items-center gap-4">
          <div className="p-3 rounded-xl bg-green-500/10 border border-green-500/20">
            <Shield className="w-6 h-6 text-green-500" />
          </div>
          <div>
            <p className="text-xs text-zinc-500 uppercase tracking-widest font-bold">Security Status</p>
            <p className="text-2xl font-display font-bold text-white">Encrypted</p>
          </div>
        </div>
      </div>

      {/* Members List */}
      <div className="glass-panel overflow-hidden">
        <div className="p-6 border-b border-white/10 bg-white/[0.02] flex items-center justify-between">
          <h2 className="font-display font-semibold text-white">Workspace Members</h2>
          <div className="flex items-center gap-2">
            <span className="text-xs text-zinc-500">Filter by role:</span>
            <select className="bg-white/5 border border-white/10 rounded-lg px-2 py-1 text-xs text-white focus:outline-none focus:border-secondary/50">
              <option>All Roles</option>
              <option>Owner</option>
              <option>Admin</option>
              <option>Member</option>
            </select>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-white/5 text-xs text-zinc-500 uppercase tracking-widest">
                <th className="px-6 py-4 font-bold">User</th>
                <th className="px-6 py-4 font-bold">Role</th>
                <th className="px-6 py-4 font-bold">Joined</th>
                <th className="px-6 py-4 font-bold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {workspace.members.map((member) => (
                <tr key={member.id} className="group hover:bg-white/[0.02] transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-secondary/20 border border-secondary/30 flex items-center justify-center text-secondary font-bold">
                        {member.user.name?.charAt(0) || "U"}
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-white">{member.user.name}</p>
                        <p className="text-xs text-zinc-500 flex items-center gap-1">
                          <Mail className="w-3 h-3" />
                          {member.user.email}
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider border ${
                      member.role === 'owner' ? 'bg-secondary/10 text-secondary border-secondary/20' :
                      member.role === 'admin' ? 'bg-primary/10 text-primary border-primary/20' :
                      'bg-white/5 text-zinc-400 border-white/10'
                    }`}>
                      {member.role}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-zinc-500 font-mono">
                    {new Date(member.createdAt).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button className="p-2 text-zinc-600 hover:text-white transition-colors">
                      <MoreVertical className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
