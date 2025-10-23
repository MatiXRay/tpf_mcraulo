import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import logo from "@/assets/logo_mcraulo.svg"
import qr from "@/assets/qr-code-example.jpg"
import { QrCode } from "lucide-react"
import { Link } from "react-router-dom"




export default function HomePage() {
  return (
    <main className="min-h-screen bg-background p-4 md:p-8">
      <div className="max-w-lg mx-auto">
        <div className="flex flex-col items-center justify-center space-y-8 min-h-screen py-8">
          {/* Logo principal */}
          <div className="w-full flex justify-center">
            <img
              src={logo}
              alt="Logo Hamburguesería"
              className="w-64 md:w-80 h-auto max-w-full drop-shadow-lg"
            />
          </div>

          {/* Botones principales */}
          <div className="flex flex-col space-y-6 w-full">
            <Link to="/home" className="w-full">
              <Button
                size="lg"
                className="cursor-pointer hover:scale-103 transition-all duration-200 w-full text-xl py-8 border-2 bg-neutral-100 border-stone-800 text-stone-900 hover:bg-primary/90 hover:text-primary-foreground font-semibold shadow-lg hover:shadow-xl"
                onClick={() => {
                  console.log("Pedir sin asociarse clicked")
                }}
              >
                🍔 Pedir sin asociarse
              </Button>
            </Link>


            <Button
              size="lg"
              className="cursor-pointer hover:scale-103 transition-all duration-200 w-full text-xl py-8 border-2 bg-neutral-100 border-stone-800 text-stone-900 hover:bg-primary/90 hover:text-primary-foreground font-semibold shadow-lg hover:shadow-xl"
              onClick={() => {
                console.log("Asociarse clicked")
              }}
            >
              👤 Asociarse
            </Button>

          </div>

          {/* Sección QR */}
          <div className="w-full">
            <Card className="p-6 shadow-xl border-2 border-border bg-neutral-100">
              <div className="flex flex-col items-center space-y-6">
                <h3 className="text-2xl font-bold text-foreground text-center">
                  Asociar con QR
                </h3>

                <div className="bg-white p-4 rounded-lg shadow-inner">
                  <img
                    src={qr}
                    alt="Código QR para asociarse"
                    className="w-48 h-48"
                  />
                </div>

                <p className="text-muted-foreground text-center text-lg">
                  Escanea con tu celular para asociarte rápidamente
                </p>

                <div className="flex items-center space-x-2">
                  <QrCode size={24} color="#800040" />
                  <span className="font-medium text-muted-foreground">
                    Fácil y rápido
                  </span>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </main>
  )
}