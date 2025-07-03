"use client";
import { useState } from "react";
import { useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { createShortUrl } from "@/actions/url/create";
import { Url } from "@prisma/client";
import UrlCreatedDialog from "./url-created-dialog";
import { AnimatedGridPattern } from "@/components/magicui/animated-grid-pattern";
import { TextAnimate } from "@/components/magicui/text-animate";
import { MagicCard } from "@/components/magicui/magic-card";
import { RainbowButton } from "@/components/magicui/rainbow-button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Accordion, AccordionItem, AccordionContent, AccordionTrigger } from "./ui/accordion";
import { Marquee } from "./magicui/marquee";
import { Zap, Shield, BarChart3, Globe, Link2Icon, Users, Clock, ArrowRight, Star } from "lucide-react";
import Image from "next/image";

export default function HomePage() {
	const [url, setUrl] = useState<string>("");
	const [response, setResponse] = useState<Url | null>(null);
	const [error, setError] = useState<string | null>(null);
	const [isDialogOpen, setIsDialogOpen] = useState(false);
	const [isLoading, setIsLoading] = useState(false);
	const { isSignedIn, user } = useUser();
	const router = useRouter();

	const handleCreateShortLink = async () => {
		if (!isSignedIn) {
			router.push("/sign-in");
			return;
		}
		if (!url.trim()) {
			setError("Lütfen geçerli bir URL girin");
			return;
		}
		try {
			setIsLoading(true);
			setError(null);
			const data = await createShortUrl(url);
			if (data) {
				setResponse(data);
				setIsDialogOpen(true);
				setUrl("");
			}
		} catch (err) {
			if (err instanceof Error) {
				setError(err.message);
			} else {
				setError("Beklenmeyen bir hata oluştu.");
			}
		} finally {
			setIsLoading(false);
		}
	};

	const features = [
		{ icon: <Zap className="h-6 w-6" />, title: "Hızlı Kısaltma", description: "Anında kısa link oluşturun." },
		{ icon: <Shield className="h-6 w-6" />, title: "Güvenli", description: "Verileriniz güvende." },
		{ icon: <BarChart3 className="h-6 w-6" />, title: "Analitik", description: "Tıklama istatistiklerini takip edin." },
		{ icon: <Globe className="h-6 w-6" />, title: "Global Erişim", description: "Dünyanın her yerinden hızlı yönlendirme." },
	];
	const stats = [
		{ icon: <Link2Icon className="h-5 w-5" />, value: "1M+", label: "Kısa Link" },
		{ icon: <Users className="h-5 w-5" />, value: "50K+", label: "Kullanıcı" },
		{ icon: <Clock className="h-5 w-5" />, value: "99.9%", label: "Uptime" },
	];
	const testimonials = [
		{ name: "Ayşe K.", text: "Çok pratik ve güvenli!", avatar: "https://randomuser.me/api/portraits/women/44.jpg" },
		{ name: "Mehmet T.", text: "Arayüzü çok sade ve kullanışlı.", avatar: "https://randomuser.me/api/portraits/men/32.jpg" },
	];
	const faqs = [
		{ q: "Shortr ücretsiz mi?", a: "Evet, tamamen ücretsizdir." },
		{ q: "Kısa linklerim ne kadar süre aktif?", a: "Süresiz olarak aktif kalır." },
		{ q: "Analitik verileri görebilir miyim?", a: "Evet, tıklama istatistiklerini görebilirsiniz." },
	];

	return (
		<div className="relative min-h-screen bg-background flex flex-col justify-between">
			{/* Arka Plan */}
			<AnimatedGridPattern className="absolute inset-0 z-0 opacity-60" />
			<div className="absolute inset-0 bg-gradient-to-b from-background/90 via-background/60 to-transparent z-10 pointer-events-none" />
			<UrlCreatedDialog isOpen={isDialogOpen} onOpenChange={setIsDialogOpen} response={response} />
			{/* Hero Section */}
			<section className="container mx-auto px-4 py-32 flex flex-col items-center justify-center relative z-20">
				<TextAnimate as="h1" className="text-5xl md:text-7xl font-extrabold tracking-tight text-foreground mb-6 text-center drop-shadow-lg">
					Kısalt, Paylaş, Takip Et.
				</TextAnimate>
				<p className="text-xl md:text-2xl text-muted-foreground mb-10 text-center max-w-2xl">
					Shortr ile linklerinizi saniyeler içinde kısaltın. Güvenli, hızlı ve tamamen ücretsiz.
				</p>
				<MagicCard className="w-full max-w-xl mx-auto mb-8 shadow-2xl">
					<CardContent className="p-6 md:p-8">
						<div className="flex flex-col md:flex-row gap-3 md:gap-2 items-center">
							<Input
								placeholder="URL'nizi buraya yapıştırın..."
								className="flex-1 text-lg"
								value={url}
								onChange={e => setUrl(e.target.value)}
								onKeyDown={e => e.key === "Enter" && handleCreateShortLink()}
								disabled={isLoading}
								autoFocus
							/>
							<RainbowButton
								onClick={handleCreateShortLink}
								disabled={isLoading}
								className="w-full md:w-auto flex items-center px-6 py-2 text-lg mt-2 md:mt-0"
							>
								{isLoading ? (
									<>
										<div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
										Oluşturuluyor...
									</>
								) : (
									<>
										<Link2Icon className="h-4 w-4 mr-2" />
										Kısalt
									</>
								)}
							</RainbowButton>
						</div>
						{error && <p className="text-destructive mt-3 text-sm text-center">{error}</p>}
						{!isSignedIn && (
							<p className="text-muted-foreground mt-3 text-sm text-center">
								Kısa link oluşturmak için giriş yapın
							</p>
						)}
					</CardContent>
				</MagicCard>
				{/* İstatistikler */}
				<div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full max-w-3xl mt-6">
					{stats.map((stat, i) => (
						<MagicCard key={i} className="h-full">
							<CardContent className="p-6 text-center flex flex-col items-center justify-center h-full">
								<div className="flex items-center justify-center mb-2 text-primary">
									{stat.icon}
									<span className="ml-2 text-2xl font-bold">{stat.value}</span>
								</div>
								<p className="text-sm text-muted-foreground">{stat.label}</p>
							</CardContent>
						</MagicCard>
					))}
				</div>
			</section>
			{/* Özellikler */}
			<section className="container mx-auto px-4 py-20 relative z-20">
				<h2 className="text-3xl font-bold text-center mb-10">
					<TextAnimate>Öne Çıkanlar</TextAnimate>
				</h2>
				<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
					{features.map((feature, i) => (
						<MagicCard key={i} className="text-center h-full transition-transform hover:scale-105">
							<CardContent className="p-8 flex flex-col items-center justify-center h-full">
								<div className="mb-4 text-primary">{feature.icon}</div>
								<h3 className="font-semibold mb-2 text-lg">{feature.title}</h3>
								<p className="text-sm text-muted-foreground">{feature.description}</p>
							</CardContent>
						</MagicCard>
					))}
				</div>
			</section>
			{/* Referanslar */}
			<section className="container mx-auto px-4 py-16 relative z-20">
				<h2 className="text-3xl font-bold text-center mb-10">
					<TextAnimate>Kullanıcı Yorumları</TextAnimate>
				</h2>
				<div className="flex flex-col md:flex-row gap-8 justify-center items-stretch">
					{testimonials.map((t, i) => (
						<MagicCard key={i} className="flex-1 max-w-md mx-auto">
							<CardContent className="p-8 flex flex-col items-center text-center">
								<Image src={t.avatar} alt={t.name} width={64} height={64} className="w-16 h-16 rounded-full mb-4 border-4 border-primary/30" />
								<div className="flex mb-2">
									{[...Array(5)].map((_, i) => <Star key={i} className="h-4 w-4 text-yellow-400" />)}
								</div>
								<p className="italic mb-2">&quot;{t.text}&quot;</p>
								<span className="font-semibold text-primary">{t.name}</span>
							</CardContent>
						</MagicCard>
					))}
				</div>
			</section>
			{/* SSS */}
			<section className="container mx-auto px-4 py-16 relative z-20">
				<h2 className="text-3xl font-bold text-center mb-10">
					<TextAnimate>Sıkça Sorulan Sorular</TextAnimate>
				</h2>
				<div className="max-w-2xl mx-auto">
					<Accordion type="single" collapsible>
						{faqs.map((faq, i) => (
							<AccordionItem value={faq.q} key={i}>
								<AccordionTrigger>{faq.q}</AccordionTrigger>
								<AccordionContent>{faq.a}</AccordionContent>
							</AccordionItem>
						))}
					</Accordion>
				</div>
			</section>
			{/* CTA */}
			<section className="container mx-auto px-4 pb-16 relative z-20">
				{!isSignedIn ? (
					<div className="text-center">
						<RainbowButton
							size="lg"
							onClick={() => router.push("/sign-up")}
							className="px-10 py-5 text-xl font-semibold shadow-lg"
						>
							Hemen Başla
							<ArrowRight className="ml-2 h-5 w-5" />
						</RainbowButton>
					</div>
				) : (
					<div className="text-center">
						<p className="text-muted-foreground text-lg">
							Hoş geldin, {user?.firstName || user?.emailAddresses[0]?.emailAddress}!
						</p>
					</div>
				)}
			</section>
			{/* Footer */}
			<footer className="w-full py-8 bg-background/80 border-t border-border text-center text-muted-foreground text-sm z-30 relative">
				<span>© {new Date().getFullYear()} Shortr. Tüm hakları saklıdır.</span>
			</footer>
		</div>
	);
}