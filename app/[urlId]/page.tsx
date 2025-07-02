import { getUrl } from "@/actions/url/get";
import RedirectPage from "@/components/redirect-page";

export default async function Page({
    params,
}: {
    params: Promise<{ urlId: string }>;
}) {
    const { urlId } = await params;
    const data = await getUrl(urlId);

    return <RedirectPage data={data} />;
}