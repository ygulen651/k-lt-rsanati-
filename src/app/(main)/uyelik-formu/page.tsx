"use client"

import { Download } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Section } from "@/components/Section"
import { Container } from "@/components/Container"

export default function UyelikFormuPage() {
  return (
    <>
      <Section padding="xl" background="muted">
        <Container>
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">Üyelik Formu</h1>
            <p className="text-lg text-muted-foreground max-w-3xl mx-auto mb-6">
              Sendikamıza üye olmak için aşağıdaki PDF formunu indirip doldurabilirsiniz.
            </p>
            <div className="flex justify-center">
              <Button size="lg" asChild>
                <a href="/documents/uyelik-formu.pdf" download="Birlik-Sen-Uyelik-Formu.pdf">
                  <Download className="h-4 w-4 mr-2" />
                  PDF Formu İndir
                </a>
              </Button>
            </div>
          </div>
        </Container>
      </Section>
    </>
  )
}
