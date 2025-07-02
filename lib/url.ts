import prisma from "./prisma";

const charSet = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";

// URL'yi normalize eder (http/https ekler, www kaldırır vs.)
export const normalizeUrl = (url: string): string => {
    if (!url || typeof url !== 'string') {
        return '';
    }

    let normalizedUrl = url.trim().toLowerCase();

    // Eğer protocol yoksa https ekle
    if (!normalizedUrl.startsWith('http://') && !normalizedUrl.startsWith('https://')) {
        // www ile başlıyorsa www'yi kaldır ve https ekle
        if (normalizedUrl.startsWith('www.')) {
            normalizedUrl = normalizedUrl.substring(4);
        }
        normalizedUrl = 'https://' + normalizedUrl;
    }

    return normalizedUrl;
}

// URL'nin gerçekten erişilebilir olup olmadığını kontrol eder
export const isValidUrl = async (url: string): Promise<boolean> => {
    if (!url || typeof url !== 'string') {
        return false;
    }

    const normalizedUrl = normalizeUrl(url);
    
    // Basit format kontrolü
    const urlPattern = /^https?:\/\/[^\s/$.?#].[^\s]*$/;
    if (!urlPattern.test(normalizedUrl)) {
        return false;
    }

    try {
        // Gerçekten erişilebilir mi kontrol et
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 5000); // 5 saniye timeout

        const response = await fetch(normalizedUrl, {
            method: 'HEAD', // Sadece header'ları al, içeriği indirme
            signal: controller.signal,
            headers: {
                'User-Agent': 'Mozilla/5.0 (compatible; URL-Checker/1.0)'
            }
        });

        clearTimeout(timeoutId);
        
        // 2xx, 3xx status kodları başarılı sayılır
        return response.status >= 200 && response.status < 400;
    } catch {
        // Fetch hatası durumunda false döndür
        return false;
    }
}

export const formater = (id: string): string => {
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";
    return `${baseUrl}/${id}`;
}

export const generateShortUrl = async (): Promise<string> => {
    let existing = false;
    let randomString = "";

    while (!existing) {
        randomString = Array.from({ length: 6 }, () => charSet[Math.floor(Math.random() * charSet.length)]).join('');
        const data = await prisma.url.findFirst({
            where: {
                shortUrl: randomString
            }
        });

        if (!data) {
            existing = true;
        }
    }

    return randomString;
}