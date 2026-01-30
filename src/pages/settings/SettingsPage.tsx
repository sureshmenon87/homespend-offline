import { exportBackup } from "@/db/backup";
import { importBackup } from "@/db/restore";
import { resetApp } from "@/db/reset";
import { toast } from "sonner";
import { ChevronRight } from "lucide-react";

export default function SettingsPage() {
  return (
    <div className="mx-auto max-w-md md:max-w-xl px-4 py-6 space-y-10">
      {/* Header */}
      <h1 className="text-2xl font-semibold text-gray-800">Settings</h1>

      {/* DATA MANAGEMENT */}
      <section className="space-y-3">
        <h2 className="text-xs font-medium tracking-wide text-gray-500">
          DATA MANAGEMENT
        </h2>

        <div className="settings-card">
          <SettingsItem
            icon="📂"
            title="Categories"
            subtitle="Manage categories used for spending classification"
            onClick={() => {}}
          />

          <Divider />

          <SettingsItem
            icon="📝"
            title="Items"
            subtitle="Manage frequently used items or labels"
            onClick={() => {}}
          />
        </div>
      </section>

      {/* DATA & STORAGE */}
      <section className="space-y-3">
        <h2 className="text-xs font-medium tracking-wide text-gray-500">
          DATA & STORAGE
        </h2>

        <div className="settings-card">
          <SettingsItem
            icon="☁️"
            title="Backup & Restore"
            subtitle="Backup your data locally or restore from a file"
            onClick={exportBackup}
          />

          <input
            type="file"
            accept="application/json"
            hidden
            id="restore-input"
            onChange={async (e) => {
              const file = e.target.files?.[0];
              if (!file) return;

              if (!confirm("This will overwrite all existing data. Continue?"))
                return;

              try {
                await importBackup(file);
                toast.success("Data restored successfully");
                location.reload();
              } catch {
                toast.error("Invalid or corrupted backup file");
              }
            }}
          />
        </div>
      </section>

      {/* PERSONALIZATION */}
      <section className="space-y-3">
        <h2 className="text-xs font-medium tracking-wide text-gray-500">
          PERSONALIZATION
        </h2>

        <div className="settings-card">
          <SettingsItem
            icon="🎨"
            title="Theme"
            subtitle="Choose light or dark appearance"
            onClick={() => {}}
          />
        </div>
      </section>

      {/* APP MANAGEMENT */}
      <section className="space-y-3">
        <h2 className="text-xs font-medium tracking-wide text-gray-500">
          APP MANAGEMENT
        </h2>

        <div className="settings-card">
          <SettingsItem
            icon="⚠️"
            title="Reset App"
            subtitle="Delete all local data and start fresh"
            danger
            onClick={async () => {
              if (!confirm("Delete all data and reset app?")) return;
              await resetApp();
              location.reload();
            }}
          />
        </div>
      </section>
    </div>
  );
}

/* ---------------- Components ---------------- */

function SettingsItem({
  icon,
  title,
  subtitle,
  onClick,
  danger = false,
}: {
  icon: string;
  title: string;
  subtitle: string;
  onClick: () => void;
  danger?: boolean;
}) {
  return (
    <button
      onClick={onClick}
      className={`flex w-full items-center justify-between gap-4 px-4 py-4 text-left
        ${danger ? "text-red-600" : "text-gray-800"}
        hover:bg-gray-50 transition`}
    >
      <div className="flex items-start gap-3">
        <span className="text-xl">{icon}</span>
        <div>
          <div className="font-medium">{title}</div>
          <div className="text-sm text-gray-500">{subtitle}</div>
        </div>
      </div>

      <ChevronRight className="h-5 w-5 text-gray-400" />
    </button>
  );
}

function Divider() {
  return <div className="h-px bg-gray-100 mx-4" />;
}
