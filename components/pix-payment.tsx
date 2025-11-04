"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useApp } from "@/contexts/app-context"
import { useToast } from "@/hooks/use-toast"
import { Bell, Copy, Check, Calendar } from "lucide-react"
import QRCode from "qrcode"

export function PixPayment() {
  const { paymentReminder, updatePaymentReminder } = useApp()
  const { toast } = useToast()
  const [pixKey, setPixKey] = useState("contato@seunegocios.com.br")
  const [amount, setAmount] = useState("99.90")
  const [qrCodeUrl, setQrCodeUrl] = useState("")
  const [copied, setCopied] = useState(false)
  const [notificationsEnabled, setNotificationsEnabled] = useState(false)
  const [daysUntilNext, setDaysUntilNext] = useState<number | null>(null)

  useEffect(() => {
    generateQRCode()
    checkNotificationPermission()
    calculateDaysUntilNext()
  }, [pixKey, amount])

  useEffect(() => {
    const interval = setInterval(() => {
      checkAndSendNotification()
      calculateDaysUntilNext()
    }, 60000) // Check every minute

    return () => clearInterval(interval)
  }, [paymentReminder])

  const generateQRCode = async () => {
    try {
      const pixString = `00020126580014br.gov.bcb.pix0136${pixKey}520400005303986540${amount}5802BR5925Mensalidade Sistema6009SAO PAULO62070503***6304`
      const url = await QRCode.toDataURL(pixString, {
        width: 300,
        margin: 2,
      })
      setQrCodeUrl(url)
    } catch (error) {
      console.error("Error generating QR code:", error)
    }
  }

  const checkNotificationPermission = () => {
    if ("Notification" in window) {
      setNotificationsEnabled(Notification.permission === "granted")
    }
  }

  const requestNotificationPermission = async () => {
    if ("Notification" in window) {
      const permission = await Notification.requestPermission()
      setNotificationsEnabled(permission === "granted")

      if (permission === "granted") {
        const now = new Date()
        const nextNotification = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000) // 30 days from now

        updatePaymentReminder({
          lastNotification: now.toISOString(),
          nextNotification: nextNotification.toISOString(),
        })

        toast({
          title: "Notificações ativadas",
          description: "Você receberá lembretes a cada 30 dias",
        })
      } else {
        toast({
          title: "Permissão negada",
          description: "Você não receberá notificações de lembrete",
          variant: "destructive",
        })
      }
    }
  }

  const checkAndSendNotification = () => {
    if (!paymentReminder || !notificationsEnabled) return

    const now = new Date()
    const nextNotification = new Date(paymentReminder.nextNotification)

    if (now >= nextNotification) {
      sendNotification()

      const newNextNotification = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000)
      updatePaymentReminder({
        lastNotification: now.toISOString(),
        nextNotification: newNextNotification.toISOString(),
      })
    }
  }

  const sendNotification = () => {
    if ("Notification" in window && Notification.permission === "granted") {
      new Notification("Lembrete de Mensalidade", {
        body: `Sua mensalidade de R$ ${amount} está próxima do vencimento. Não esqueça de realizar o pagamento!`,
        icon: "/payment-icon.jpg",
        tag: "payment-reminder",
      })
    }
  }

  const calculateDaysUntilNext = () => {
    if (!paymentReminder) {
      setDaysUntilNext(null)
      return
    }

    const now = new Date()
    const nextNotification = new Date(paymentReminder.nextNotification)
    const diffTime = nextNotification.getTime() - now.getTime()
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))

    setDaysUntilNext(diffDays > 0 ? diffDays : 0)
  }

  const copyPixKey = () => {
    navigator.clipboard.writeText(pixKey)
    setCopied(true)
    toast({
      title: "Copiado",
      description: "Chave PIX copiada para a área de transferência",
    })
    setTimeout(() => setCopied(false), 2000)
  }

  const testNotification = () => {
    sendNotification()
    toast({
      title: "Notificação enviada",
      description: "Verifique suas notificações",
    })
  }

  return (
    <div className="grid gap-6 lg:grid-cols-2">
      <Card>
        <CardHeader>
          <CardTitle>Pagamento da Mensalidade</CardTitle>
          <CardDescription>Escaneie o QR Code ou copie a chave PIX para realizar o pagamento</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="pix-key">Chave PIX</Label>
              <div className="flex gap-2">
                <Input id="pix-key" value={pixKey} onChange={(e) => setPixKey(e.target.value)} />
                <Button variant="outline" size="icon" onClick={copyPixKey}>
                  {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                </Button>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="amount">Valor (R$)</Label>
              <Input id="amount" type="number" step="0.01" value={amount} onChange={(e) => setAmount(e.target.value)} />
            </div>
          </div>

          {qrCodeUrl && (
            <div className="flex flex-col items-center gap-4 p-6 bg-muted rounded-lg">
              <img src={qrCodeUrl || "/placeholder.svg"} alt="QR Code PIX" className="w-64 h-64" />
              <div className="text-center">
                <p className="font-semibold text-lg">
                  {Number.parseFloat(amount).toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}
                </p>
                <p className="text-sm text-muted-foreground">Mensalidade do sistema</p>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Lembretes de Pagamento</CardTitle>
          <CardDescription>Configure notificações automáticas a cada 30 dias</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-start gap-4 p-4 bg-muted rounded-lg">
            <Bell className="h-5 w-5 text-muted-foreground mt-0.5" />
            <div className="flex-1 space-y-1">
              <p className="text-sm font-medium">Notificações Automáticas</p>
              <p className="text-sm text-muted-foreground">
                Receba lembretes automáticos para não esquecer de pagar sua mensalidade
              </p>
            </div>
          </div>

          {!notificationsEnabled ? (
            <Button onClick={requestNotificationPermission} className="w-full">
              <Bell className="h-4 w-4 mr-2" />
              Ativar Notificações
            </Button>
          ) : (
            <div className="space-y-4">
              <div className="flex items-center gap-2 text-sm text-green-600 dark:text-green-400">
                <Check className="h-4 w-4" />
                <span>Notificações ativadas</span>
              </div>

              {paymentReminder && daysUntilNext !== null && (
                <div className="p-4 border border-border rounded-lg space-y-3">
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm font-medium">Próximo lembrete</span>
                  </div>
                  <div className="text-2xl font-bold">
                    {daysUntilNext === 0 ? "Hoje" : `${daysUntilNext} dia${daysUntilNext > 1 ? "s" : ""}`}
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {new Date(paymentReminder.nextNotification).toLocaleDateString("pt-BR", {
                      day: "2-digit",
                      month: "long",
                      year: "numeric",
                    })}
                  </p>
                </div>
              )}

              <Button variant="outline" onClick={testNotification} className="w-full bg-transparent">
                Testar Notificação
              </Button>
            </div>
          )}

          <div className="p-4 bg-blue-50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-800 rounded-lg">
            <p className="text-sm text-blue-900 dark:text-blue-100">
              <strong>Dica:</strong> As notificações funcionam mesmo quando o navegador está fechado, desde que você
              mantenha as permissões ativadas.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
