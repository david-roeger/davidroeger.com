import type { Writable } from 'svelte/store';

export type OpeningHoursSpecification = {
	opens: string;
	closes: string;
	dayOfWeek: string | string[];
	validFrom?: string;
	validThrough?: string;
};

export type Offer = {
	priceSpecification: PriceSpecification;
	itemOffered: Service;
};

export type PriceSpecification = {
	type: string;
	priceCurrency: string;
	price: string;
};

export type Service = {
	name: string;
	description: string;
};

export type Geo = {
	latitude: string;
	longitude: string;
};

export type GeoCircle = {
	geoMidpoint: Geo;
	geoRadius: string;
};

export type Action = {
	actionName: string;
	actionType: string;
	target: string;
};

export type Person = {
	name: string;
};
export type Answer = {
	text: string;
	dateCreated?: string;
	upvoteCount?: number;
	url?: string;
	author?: Person;
};

export type Question = {
	name: string;
	answerCount: number;
	acceptedAnswer?: Answer;
	suggestedAnswer?: Answer[];
	text?: string;
	author?: Person;
	upvoteCount?: number;
	dateCreated?: string;
};

export type Instruction = {
	name?: string;
	text: string;
	url?: string;
	image?: string;
};
export type Performer = {
	name: string;
};

export type Location = {
	name: string;
	address: Address;
	sameAs?: string;
};
export type ContactPoint = {
	contactType: string;
	telephone: string;
	areaServed?: string | string[];
	availableLanguage?: string | string[];
	contactOption?: string | string[];
};
export type CreativeWork = {
	author: string;
	about: string;
	name: string;
	datePublished: string;
	audience?: string;
	keywords?: string;
	thumbnailUrl?: string;
	image?: string;
};

export type Producer = {
	name: string;
	url?: string;
};
export type ContactPoint = {
	contactType: string;
	telephone: string;
	areaServed?: string | string[];
	availableLanguage?: string | string[];
	contactOption?: string | string[];
};

export type Question = {
	questionName: string;
	acceptedAnswerText: string;
};
export type Provider = {
	type?: 'Organization' | 'Person';
	name: string;
	url?: string;
};
export type ItemListElements = {
	item: string;
	name: string;
	position: number;
};
export type OpenGraphMedia = {
	url: string;
	width?: number;
	height?: number;
	alt?: string;
	type?: string;
	secureUrl?: string;
};

export type Address = {
	streetAddress: string;
	addressLocality: string;
	addressRegion?: string;
	postalCode: string;
	addressCountry: string;
};

export type Video = {
	name: string;
	description: string;
	thumbnailUrls: string[];
	uploadDate: string;
	contentUrl?: string;
	duration?: string;
	embedUrl?: string;
	expires?: string;
	hasPart?: Clip | Clip[];
	watchCount?: number;
	publication?: BroadcastEvent | BroadcastEvent[];
	regionsAllowed?: string | string[];
};

export type Clip = {
	name: string;
	startOffset: number;
	url: string;
};

export type BroadcastEvent = {
	name?: string;
	isLiveBroadcast: boolean;
	startDate: string;
	endDate: string;
};

export type Offers = {
	price: string;
	priceCurrency: string;
	priceValidUntil?: string;
	itemCondition?: string;
	availability?: string;
	url?: string;
	seller: {
		name: string;
	};
};

export type AggregateOffer = {
	priceCurrency: string;
	lowPrice: string;
	highPrice?: string;
	offerCount?: string;
	offers?: Offers | Offers[];
};

export type OpenGraphVideoActors = {
	profile: string;
	role?: string;
};

export type OpenGraph = {
	url?: string;
	type?: string;
	title?: string;
	description?: string;
	images?: OpenGraphMedia[];
	videos?: OpenGraphMedia[];
	defaultImageHeight?: number;
	defaultImageWidth?: number;
	locale?: string;
	site_name?: string;
	profile?: OpenGraphProfile;
	book?: OpenGraphBook;
	article?: OpenGraphArticle;
	video?: OpenGraphVideo;
};

export type OpenGraphProfile = {
	firstName?: string;
	lastName?: string;
	username?: string;
	gender?: string;
};

export type OpenGraphBook = {
	authors?: string[];
	isbn?: string;
	releaseDate?: string;
	tags?: string[];
};

export type OpenGraphArticle = {
	publishedTime?: string;
	modifiedTime?: string;
	expirationTime?: string;

	authors?: string[];
	section?: string;
	tags?: string[];
};

export type OpenGraphVideo = {
	actors?: OpenGraphVideoActors[];
	directors?: string[];
	writers?: string[];
	duration?: number;
	releaseDate?: string;
	tags?: string[];
	series?: string;
};

export type Twitter = {
	handle?: string;
	site?: string;
	cardType?: string;
};

type MobileAlternate = {
	media: string;
	href: string;
};

type LanguageAlternate = {
	hrefLang: string;
	href: string;
};

type LinkTag = {
	rel: string;
	href: string;
	sizes?: string;
	type?: string;
	color?: string;
	keyOverride?: string;
	as?: string;
	crossOrigin?: string;
};

export type BaseMetaTag = {
	content: string;
	keyOverride?: string;
};

export interface HTML5MetaTag extends BaseMetaTag {
	name: string;
	property?: undefined;
	httpEquiv?: undefined;
	media?: string;
}

export interface RDFaMetaTag extends BaseMetaTag {
	property: string;
	name?: undefined;
	httpEquiv?: undefined;
}

export interface HTTPEquivMetaTag extends BaseMetaTag {
	httpEquiv:
		| 'content-security-policy'
		| 'content-type'
		| 'default-style'
		| 'x-ua-compatible'
		| 'refresh';
	name?: undefined;
	property?: undefined;
}

export type MetaTag = HTML5MetaTag | RDFaMetaTag | HTTPEquivMetaTag;

export type ImagePrevSize = 'none' | 'standard' | 'large';

export type AggregateRating = {
	ratingValue: string;
	reviewCount?: string;
	ratingCount?: string;
	bestRating?: string;
};

export type GamePlayMode = 'CoOp' | 'MultiPlayer' | 'SinglePlayer';

export type Review = {
	author: string;
	datePublished?: string;
	reviewBody?: string;
	name?: string;
	publisher?: Publisher;
	reviewRating: ReviewRating;
};

export type ReviewRating = {
	bestRating?: string;
	ratingValue: string;
	worstRating?: string;
};

export type Author = {
	type: string;
	name: string;
};

export type Publisher = {
	type: string;
	name: string;
};

export type ReviewedBy = {
	type?: string;
	name: string;
};

export type ApplicationCategory =
	| 'Game'
	| 'SocialNetworking'
	| 'Travel'
	| 'Shopping'
	| 'Sports'
	| 'Lifestyle'
	| 'Business'
	| 'Design'
	| 'Developer'
	| 'Driver'
	| 'Educational'
	| 'Health'
	| 'Finance'
	| 'Security'
	| 'Browser'
	| 'Communication'
	| 'DesktopEnhancement'
	| 'Entertainment'
	| 'Multimedia'
	| 'Home'
	| 'Utilities'
	| 'Reference';

export type OrganizationCategory =
	| 'Airline'
	| 'Consortium'
	| 'Corporation'
	| 'EducationalOrganization'
	| 'FundingScheme'
	| 'GovernmentOrganization'
	| 'LibrarySystem'
	| 'LocalBusiness'
	| 'MedicalOrganization'
	| 'NGO'
	| 'NewsMediaOrganization'
	| 'PerformingGroup'
	| 'Project'
	| 'ResearchOrganization'
	| 'SportsOrganization'
	| 'WorkersUnion'
	| 'Organization';

export type AdditionalRobotsProps = {
	nosnippet?: boolean;
	maxSnippet?: number;
	maxImagePreview?: ImagePrevSize;
	maxVideoPreview?: number;
	noarchive?: boolean;
	unavailableAfter?: string;
	noimageindex?: boolean;
	notranslate?: boolean;
};

export type SepProps = {
	title?: string;
	titleTemplate?: string;
	noindex?: boolean;
	nofollow?: boolean;
	robotsProps?: AdditionalRobotsProps;
	description?: string;
	canonical?: string;
	mobileAlternate?: MobileAlternate;
	languageAlternates?: LanguageAlternate[];
	openGraph?: OpenGraph;
	facebook?: { appId: string };
	twitter?: Twitter;
	additionalMetaTags?: MetaTag[];
	additionalLinkTags?: LinkTag[];
};

export type DefaultSeoProps = {
	title?: Writable<string | undefined>;
	titleTemplate?: Writable<string | undefined>;
	noindex?: Writable<boolean | undefined>;
	nofollow?: Writable<boolean | undefined>;
	robotsProps?: Writable<AdditionalRobotsProps | undefined>;
	description?: Writable<string | undefined>;
	canonical?: Writable<string | undefined>;
	mobileAlternate?: Writable<MobileAlternate | undefined>;
	languageAlternates?: Writable<LanguageAlternate[] | undefined>;
	openGraph?: Writable<OpenGraph | undefined>;
	facebook?: Writable<{ appId: string } | undefined>;
	twitter?: Writable<Twitter | undefined>;
	additionalMetaTags?: Writable<MetaTag[] | undefined>;
	additionalLinkTags?: Writable<LinkTag[] | undefined>;
};

export type Tags = {
	[key: string]: string | undefined;
};
