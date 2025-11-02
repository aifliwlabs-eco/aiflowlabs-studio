// app/page.tsx
import Card from "@/components/Card";
import { WaitlistDialog } from "@/components/WaitlistDialog";

export default function Home() {
  return (
    <main id="legacy-root">
      {/* Верхняя декоративная лента */}
      <div className="ribbon" aria-hidden="true" />

      {/* Главная карточка с логотипом и кнопками */}
      <Card />

      {/* Современная shadcn/ui модалка (открывается из Card по id="openWaitlist") */}
      <WaitlistDialog />

      {/* Футер */}
      <footer className="tw-text-center tw-mt-[40px] tw-opacity-70">
        © 2025 aiflowlabs.studio
      </footer>
    </main>
  );
}
