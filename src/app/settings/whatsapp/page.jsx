"use client";

import { useState } from "react";
import { DashboardLayout } from "@/components/Layout/DashboardLayout";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Spinner } from "@/components/ui/Spinner";
import { useWhatsAppStatus, useRestartWhatsApp } from "@/hooks/api/useWhatsApp";
import { toast } from "sonner";
import {
  RefreshCw,
  CheckCircle,
  XCircle,
  Smartphone,
  Loader2,
} from "lucide-react";

export default function WhatsAppSettingsPage() {
  const { data, isLoading, error } = useWhatsAppStatus();
  const restartWhatsApp = useRestartWhatsApp();

  const handleRestart = async () => {
    try {
      await restartWhatsApp.mutateAsync();
      toast.success("WhatsApp client restart initiated");
    } catch (err) {
      toast.error("Failed to restart WhatsApp client");
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "connected":
        return "text-green-500";
      case "qr_ready":
        return "text-yellow-500";
      case "connecting":
        return "text-blue-500";
      default:
        return "text-red-500";
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "connected":
        return <CheckCircle className="w-6 h-6 text-green-500" />;
      case "qr_ready":
        return <Smartphone className="w-6 h-6 text-yellow-500" />;
      case "connecting":
        return <Loader2 className="w-6 h-6 text-blue-500 animate-spin" />;
      default:
        return <XCircle className="w-6 h-6 text-red-500" />;
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case "connected":
        return "Connected";
      case "qr_ready":
        return "Waiting for QR Scan";
      case "connecting":
        return "Connecting...";
      default:
        return "Disconnected";
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="bg-primary rounded-lg p-6 text-white">
          <h1 className="text-2xl font-bold">WhatsApp Settings</h1>
          <p className="text-primary-100">
            MAA Computers &gt; Settings &gt; WhatsApp
          </p>
        </div>

        {/* Status Card */}
        <Card>
          <div className="p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold dark:text-gray-100">
                Connection Status
              </h2>
              <Button
                variant="secondary"
                onClick={handleRestart}
                disabled={restartWhatsApp.isPending}
                className="flex items-center gap-2"
              >
                <RefreshCw
                  className={`w-4 h-4 ${
                    restartWhatsApp.isPending ? "animate-spin" : ""
                  }`}
                />
                {restartWhatsApp.isPending
                  ? "Restarting..."
                  : "Restart WhatsApp"}
              </Button>
            </div>

            {isLoading ? (
              <div className="flex justify-center py-8">
                <Spinner />
              </div>
            ) : error ? (
              <div className="text-center py-8">
                <XCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
                <p className="text-red-500 font-medium">
                  Failed to connect to backend
                </p>
                <p className="text-gray-500 text-sm mt-2">
                  Make sure the backend server is running
                </p>
              </div>
            ) : (
              <>
                {/* Status Display */}
                <div className="flex items-center gap-4 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg mb-6">
                  {getStatusIcon(data?.data?.status)}
                  <div>
                    <p
                      className={`font-semibold text-lg ${getStatusColor(
                        data?.data?.status
                      )}`}
                    >
                      {getStatusText(data?.data?.status)}
                    </p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      {data?.data?.status === "connected"
                        ? "WhatsApp is ready to send messages"
                        : data?.data?.status === "qr_ready"
                        ? "Scan the QR code below with your phone"
                        : data?.data?.status === "connecting"
                        ? "Please wait while connecting..."
                        : "Click 'Restart WhatsApp' to connect"}
                    </p>
                  </div>
                </div>

                {/* QR Code Display */}
                {data?.data?.qrCode && (
                  <div className="flex flex-col items-center py-6">
                    <div className="bg-white p-4 rounded-lg shadow-lg border-2 border-green-500">
                      <img
                        src={data.data.qrCode}
                        alt="WhatsApp QR Code"
                        className="w-64 h-64"
                      />
                    </div>
                    <div className="mt-4 text-center">
                      <p className="text-sm text-gray-600 dark:text-gray-400 font-medium">
                        📱 Open WhatsApp on your phone
                      </p>
                      <p className="text-sm text-gray-500 dark:text-gray-500">
                        Go to Settings → Linked Devices → Link a Device
                      </p>
                      <p className="text-sm text-gray-500 dark:text-gray-500">
                        Point your phone camera at this QR code
                      </p>
                    </div>
                  </div>
                )}

                {/* Connected Info */}
                {data?.data?.status === "connected" && (
                  <div className="flex flex-col items-center py-8">
                    <div className="w-24 h-24 rounded-full bg-green-100 dark:bg-green-900 flex items-center justify-center mb-4">
                      <CheckCircle className="w-12 h-12 text-green-500" />
                    </div>
                    <p className="text-lg font-medium text-gray-700 dark:text-gray-300">
                      WhatsApp is Connected! ✅
                    </p>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
                      You can now send invoices via WhatsApp from the Fees page
                    </p>
                  </div>
                )}
              </>
            )}
          </div>
        </Card>

        {/* Instructions Card */}
        <Card>
          <div className="p-6">
            <h3 className="text-lg font-semibold mb-4 dark:text-gray-100">
              How to Connect
            </h3>
            <ol className="list-decimal list-inside space-y-2 text-gray-600 dark:text-gray-400">
              <li>
                Click &quot;Restart WhatsApp&quot; if no QR code is showing
              </li>
              <li>Open WhatsApp on your phone</li>
              <li>
                Go to <strong>Settings</strong> →{" "}
                <strong>Linked Devices</strong>
              </li>
              <li>
                Tap on <strong>Link a Device</strong>
              </li>
              <li>Point your phone&apos;s camera at the QR code above</li>
              <li>Wait for the connection to be established</li>
            </ol>
            <div className="mt-4 p-3 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg">
              <p className="text-sm text-yellow-700 dark:text-yellow-400">
                ⚠️ <strong>Note:</strong> Keep this page open while scanning.
                The QR code refreshes automatically every few seconds.
              </p>
            </div>
          </div>
        </Card>
      </div>
    </DashboardLayout>
  );
}
