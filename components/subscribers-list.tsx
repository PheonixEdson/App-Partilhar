"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { useApp } from "@/contexts/app-context"
import { useToast } from "@/hooks/use-toast"
import { Check, Mail, Trash2, QrCode } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import QRCodeLib from "qrcode"

export function SubscribersList() {
  const { subscribers, markSubscriberAsPaid, deleteSubscriber, checkAndResetMonthlyPayments } = useApp()
  const { toast } = useToast()
  const [qrCodeUrl, setQrCodeUrl] = useState("")
  const [selectedSubscriber, setSelectedSubscriber] = useState<string>("")

  useEffect(() => {
    // Check and reset payments on mount and every hour
    checkAndResetMonthlyPayments()
    const interval = setInterval(checkAndResetMonthlyPayments, 60 * 60 * 1000)
    return () => clearInterval(interval)
  }, [])

  const handleMarkAsPaid = (id: string, name: string) => {
    markSubscriberAsPaid(id)
    toast({
      title: "Pagamento registrado",
      description: `Pagamento de ${name} foi confirmado`,
    })
  }

  const handleDelete = (id: string, name: string) => {
    deleteSubscriber(id)
    toast({
      title: "Assinante removido",
      description: `${name} foi removido da lista`,
    })
  }

  const handleSendEmail = (email: string, name: string) => {
    const subject = encodeURIComponent("Cobrança de Mensalidade")
    const body = encodeURIComponent(
      `Olá ${name},\n\nEste é um lembrete sobre o pagamento da sua mensalidade.\n\nPor favor, realize o pagamento via PIX usando a chave disponível no sistema.\n\nAtenciosamente,\nEquipe de Gestão`,
    )
    window.open(`mailto:${email}?subject=${subject}&body=${body}`, "_blank")

    toast({
      title: "Email aberto",
      description: "Cliente de email foi aberto para enviar a cobrança",
    })
  }

  const generateQRCodeForSubscriber = async (subscriberId: string, subscriberName: string) => {
    try {
      const pixKey = "contato@seunegocios.com.br"
      const amount = "99.90"
      const pixString = `00020126580014br.gov.bcb.pix0136${pixKey}520400005303986540${amount}5802BR5925${subscriberName}6009SAO PAULO62070503***6304`
      const url = await QRCodeLib.toDataURL(pixString, {
        width: 300,
        margin: 2,
      })
      setQrCodeUrl(url)
      setSelectedSubscriber(subscriberName)
    } catch (error) {
      console.error("Error generating QR code:", error)
      toast({
        title: "Erro",
        description: "Não foi possível gerar o QR Code",
        variant: "destructive",
      })
    }
  }

  const paidCount = subscribers.filter((s) => s.isPaid).length
  const pendingCount = subscribers.filter((s) => !s.isPaid).length

  return (
    <Card>
      <CardHeader>
        <CardTitle>Lista de Assinantes</CardTitle>
        <CardDescription>
          Gerencie os assinantes e seus pagamentos mensais
          <div className="flex gap-4 mt-2">
            <span className="text-sm">
              <Badge variant="default" className="mr-1">
                {paidCount}
              </Badge>
              Pagos
            </span>
            <span className="text-sm">
              <Badge variant="destructive" className="mr-1">
                {pendingCount}
              </Badge>
              Pendentes
            </span>
          </div>
        </CardDescription>
      </CardHeader>
      <CardContent>
        {subscribers.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            <p>Nenhum assinante cadastrado ainda</p>
          </div>
        ) : (
          <div className="space-y-3">
            {subscribers.map((subscriber) => (
              <div
                key={subscriber.id}
                className="flex items-center justify-between p-4 border border-border rounded-lg hover:bg-muted/50 transition-colors"
              >
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <h3 className="font-medium">{subscriber.name}</h3>
                    <Badge variant={subscriber.isPaid ? "default" : "destructive"}>
                      {subscriber.isPaid ? "Pago" : "Pendente"}
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground">{subscriber.email}</p>
                  {subscriber.lastPaymentDate && (
                    <p className="text-xs text-muted-foreground mt-1">
                      Último pagamento:{" "}
                      {new Date(subscriber.lastPaymentDate).toLocaleDateString("pt-BR", {
                        day: "2-digit",
                        month: "short",
                        year: "numeric",
                      })}
                    </p>
                  )}
                </div>

                <div className="flex items-center gap-2">
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => generateQRCodeForSubscriber(subscriber.id, subscriber.name)}
                      >
                        <QrCode className="h-4 w-4" />
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>QR Code PIX - {selectedSubscriber}</DialogTitle>
                        <DialogDescription>Escaneie o código para realizar o pagamento</DialogDescription>
                      </DialogHeader>
                      <div className="flex flex-col items-center gap-4 py-4">
                        {qrCodeUrl && (
                          <img src={qrCodeUrl || "/placeholder.svg"} alt="QR Code PIX" className="w-64 h-64" />
                        )}
                        <div className="text-center">
                          <p className="font-semibold text-lg">R$ 99,90</p>
                          <p className="text-sm text-muted-foreground">Mensalidade mensal</p>
                        </div>
                      </div>
                    </DialogContent>
                  </Dialog>

                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleSendEmail(subscriber.email, subscriber.name)}
                  >
                    <Mail className="h-4 w-4" />
                  </Button>

                  {!subscriber.isPaid ? (
                    <Button
                      variant="default"
                      size="sm"
                      onClick={() => handleMarkAsPaid(subscriber.id, subscriber.name)}
                    >
                      <Check className="h-4 w-4" />
                    </Button>
                  ) : (
                    <Button variant="outline" size="sm" disabled>
                      <Check className="h-4 w-4 text-green-600" />
                    </Button>
                  )}

                  <Button variant="outline" size="sm" onClick={() => handleDelete(subscriber.id, subscriber.name)}>
                    <Trash2 className="h-4 w-4 text-destructive" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}

        <div className="mt-6 p-4 bg-muted rounded-lg">
          <p className="text-sm text-muted-foreground">
            <strong>Nota:</strong> Os pagamentos são resetados automaticamente a cada 30 dias. Quando um assinante
            realiza o pagamento, clique no botão de confirmação para registrar.
          </p>
        </div>
      </CardContent>
    </Card>
  )
}
