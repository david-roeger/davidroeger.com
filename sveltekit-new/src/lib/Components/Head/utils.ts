import type { SepProps, OpenGraphMedia, Tags } from './types';

const defaults = {
	templateTitle: '',
	noindex: false,
	nofollow: false,
};

const buildOpenGraphMediaTags = (
	mediaType: 'image' | 'video',
	media: OpenGraphMedia[] = [],
): Tags[] => {
	const mediaTags = media.reduce((tags, medium, index) => {
		tags.push({
			tag: 'meta',
			key: `og:${mediaType}:0${index}`,
			property: `og:${mediaType}`,
			content: medium.url,
		});

		if (medium.alt) {
			tags.push({
				tag: 'meta',
				key: `og:${mediaType}:alt0${index}`,
				property: `og:${mediaType}:alt`,
				content: medium.alt,
			});
		}

		if (medium.secureUrl) {
			tags.push({
				tag: 'meta',
				key: `og:${mediaType}:secure_url0${index}`,
				property: `og:${mediaType}:secure_url`,
				content: medium.secureUrl.toString(),
			});
		}

		if (medium.type) {
			tags.push({
				tag: 'meta',
				key: `og:${mediaType}:type0${index}`,
				property: `og:${mediaType}:type`,
				content: medium.type.toString(),
			});
		}

		if (medium.width) {
			tags.push({
				tag: 'meta',
				key: `og:${mediaType}:width0${index}`,
				property: `og:${mediaType}:width`,
				content: medium.width.toString(),
			});
		}

		if (medium.height) {
			tags.push({
				tag: 'meta',
				key: `og:${mediaType}:height${index}`,
				property: `og:${mediaType}:height`,
				content: medium.height.toString(),
			});
		}
		return tags;
	}, [] as Tags[]);

	return mediaTags;
};

const buildTags = (config: SepProps): Tags[] => {
	const tagsToRender: Tags[] = [];

	if (config.titleTemplate) {
		defaults.templateTitle = config.titleTemplate;
	}

	let updatedTitle = '';
	if (config.title) {
		updatedTitle = config.title;
		if (defaults.templateTitle) {
			updatedTitle = defaults.templateTitle.replace(
				/%s/g,
				() => updatedTitle,
			);
		}
	}

	if (updatedTitle) {
		tagsToRender.push({
			tag: 'title',
			key: 'title',
			slot: updatedTitle,
		});
	}

	const noindex = config.noindex || defaults.noindex;
	const nofollow = config.nofollow || defaults.nofollow;

	let robotsParams = '';
	if (config.robotsProps) {
		const {
			nosnippet,
			maxSnippet,
			maxImagePreview,
			maxVideoPreview,
			noarchive,
			noimageindex,
			notranslate,
			unavailableAfter,
		} = config.robotsProps;

		robotsParams = `${nosnippet ? ',nosnippet' : ''}${
			maxSnippet ? `,max-snippet:${maxSnippet}` : ''
		}${maxImagePreview ? `,max-image-preview:${maxImagePreview}` : ''}${
			noarchive ? ',noarchive' : ''
		}${unavailableAfter ? `,unavailable_after:${unavailableAfter}` : ''}${
			noimageindex ? ',noimageindex' : ''
		}${maxVideoPreview ? `,max-video-preview:${maxVideoPreview}` : ''}${
			notranslate ? ',notranslate' : ''
		}`;
	}

	if (noindex || nofollow) {
		tagsToRender.push({
			tag: 'meta',
			key: 'robots',
			name: 'robots',
			content: `${noindex ? 'noindex' : 'index'},${
				nofollow ? 'nofollow' : 'follow'
			}${robotsParams}`,
		});
	} else {
		tagsToRender.push({
			tag: 'meta',
			key: 'robots',
			name: 'robots',
			content: `index,follow${robotsParams}`,
		});
	}

	if (config.description) {
		tagsToRender.push({
			tag: 'meta',
			key: 'description',
			name: 'description',
			content: config.description,
		});
	}

	if (config.mobileAlternate) {
		tagsToRender.push({
			tag: 'link',
			rel: 'alternate',
			key: 'mobileAlternate',
			media: config.mobileAlternate.media,
			href: config.mobileAlternate.href,
		});
	}

	if (config.languageAlternates && config.languageAlternates.length > 0) {
		config.languageAlternates.forEach((languageAlternate) => {
			tagsToRender.push({
				tag: 'link',
				rel: 'alternate',
				key: `languageAlternate-${languageAlternate.hrefLang}`,
				hrefLang: languageAlternate.hrefLang,
				href: languageAlternate.href,
			});
		});
	}

	if (config.twitter) {
		if (config.twitter.cardType) {
			tagsToRender.push({
				tag: 'meta',
				key: 'twitter:card',
				name: 'twitter:card',
				content: config.twitter.cardType,
			});
		}

		if (config.twitter.site) {
			tagsToRender.push({
				tag: 'meta',
				key: 'twitter:site',
				name: 'twitter:site',
				content: config.twitter.site,
			});
		}

		if (config.twitter.handle) {
			tagsToRender.push({
				tag: 'meta',
				key: 'twitter:creator',
				name: 'twitter:creator',
				content: config.twitter.handle,
			});
		}
	}

	if (config.facebook) {
		if (config.facebook.appId) {
			tagsToRender.push({
				tag: 'meta',
				key: 'fb:app_id',
				property: 'fb:app_id',
				content: config.facebook.appId,
			});
		}
	}

	if (config.openGraph?.title || updatedTitle) {
		tagsToRender.push({
			tag: 'meta',
			key: 'og:title',
			property: 'og:title',
			content: config.openGraph?.title || updatedTitle,
		});
	}

	const description = config.openGraph?.description || config.description
	if (description) {
		tagsToRender.push({
			tag: 'meta',
			key: 'og:description',
			property: 'og:description',
			content: description,
		});
	}

	if (config.openGraph) {
		const url  = config.openGraph.url || config.canonical
		if (url) {
			tagsToRender.push({
				tag: 'meta',
				key: 'og:url',
				property: 'og:url',
				content: url,
			});
		}

		if (config.openGraph.type) {
			const type = config.openGraph.type.toLowerCase();

			tagsToRender.push({
				tag: 'meta',
				key: 'og:type',
				property: 'og:type',
				content: type,
			});

			if (type === 'profile' && config.openGraph.profile) {
				if (config.openGraph.profile.firstName) {
					tagsToRender.push({
						tag: 'meta',
						key: 'profile:first_name',
						property: 'profile:first_name',
						content: config.openGraph.profile.firstName,
					});
				}

				if (config.openGraph.profile.lastName) {
					tagsToRender.push({
						tag: 'meta',
						key: 'profile:last_name',
						property: 'profile:last_name',
						content: config.openGraph.profile.lastName,
					});
				}

				if (config.openGraph.profile.username) {
					tagsToRender.push({
						tag: 'meta',
						key: 'profile:username',
						property: 'profile:username',
						content: config.openGraph.profile.username,
					});
				}

				if (config.openGraph.profile.gender) {
					tagsToRender.push({
						tag: 'meta',
						key: 'profile:gender',
						property: 'profile:gender',
						content: config.openGraph.profile.gender,
					});
				}
			} else if (type === 'book' && config.openGraph.book) {
				if (
					config.openGraph.book.authors &&
					config.openGraph.book.authors.length
				) {
					config.openGraph.book.authors.forEach((author, index) => {
						tagsToRender.push({
							tag: 'meta',
							key: `book:author:0${index}`,
							property: 'book:author',
							content: author,
						});
					});
				}

				if (config.openGraph.book.isbn) {
					tagsToRender.push({
						tag: 'meta',
						key: 'book:isbn',
						property: 'book:isbn',
						content: config.openGraph.book.isbn,
					});
				}

				if (config.openGraph.book.releaseDate) {
					tagsToRender.push({
						tag: 'meta',
						key: 'book:release_date',
						property: 'book:release_date',
						content: config.openGraph.book.releaseDate,
					});
				}

				if (
					config.openGraph.book.tags &&
					config.openGraph.book.tags.length
				) {
					config.openGraph.book.tags.forEach((tag, index) => {
						tagsToRender.push({
							tag: 'meta',
							key: `book:tag:0${index}`,
							property: 'book:tag',
							content: tag,
						});
					});
				}
			} else if (type === 'article' && config.openGraph.article) {
				if (config.openGraph.article.publishedTime) {
					tagsToRender.push({
						tag: 'meta',
						key: 'article:published_time',
						property: 'article:published_time',
						content: config.openGraph.article.publishedTime,
					});
				}

				if (config.openGraph.article.modifiedTime) {
					tagsToRender.push({
						tag: 'meta',
						key: 'article:modified_time',
						property: 'article:modified_time',
						content: config.openGraph.article.modifiedTime,
					});
				}

				if (config.openGraph.article.expirationTime) {
					tagsToRender.push({
						tag: 'meta',
						key: 'article:expiration_time',
						property: 'article:expiration_time',
						content: config.openGraph.article.expirationTime,
					});
				}

				if (
					config.openGraph.article.authors &&
					config.openGraph.article.authors.length
				) {
					config.openGraph.article.authors.forEach(
						(author, index) => {
							tagsToRender.push({
								tag: 'meta',
								key: `article:author:0${index}`,
								property: 'article:author',
								content: author,
							});
						},
					);
				}

				if (config.openGraph.article.section) {
					tagsToRender.push({
						tag: 'meta',
						key: 'article:section',
						property: 'article:section',
						content: config.openGraph.article.section,
					});
				}

				if (
					config.openGraph.article.tags &&
					config.openGraph.article.tags.length
				) {
					config.openGraph.article.tags.forEach((tag, index) => {
						tagsToRender.push({
							tag: 'meta',
							key: `article:tag:0${index}`,
							property: 'article:tag',
							content: tag,
						});
					});
				}
			} else if (
				(type === 'video.movie' ||
					type === 'video.episode' ||
					type === 'video.tv_show' ||
					type === 'video.other') &&
				config.openGraph.video
			) {
				if (
					config.openGraph.video.actors &&
					config.openGraph.video.actors.length
				) {
					config.openGraph.video.actors.forEach((actor, index) => {
						if (actor.profile) {
							tagsToRender.push({
								tag: 'meta',
								key: `video:actor:0${index}`,
								property: 'video:actor',
								content: actor.profile,
							});
						}

						if (actor.role) {
							tagsToRender.push({
								tag: 'meta',
								key: `video:actor:role:0${index}`,
								property: 'video:actor:role',
								content: actor.role,
							});
						}
					});
				}

				if (
					config.openGraph.video.directors &&
					config.openGraph.video.directors.length
				) {
					config.openGraph.video.directors.forEach(
						(director, index) => {
							tagsToRender.push({
								tag: 'meta',
								key: `video:director:0${index}`,
								property: 'video:director',
								content: director,
							});
						},
					);
				}

				if (
					config.openGraph.video.writers &&
					config.openGraph.video.writers.length
				) {
					config.openGraph.video.writers.forEach((writer, index) => {
						tagsToRender.push({
							tag: 'meta',
							key: `video:writer:0${index}`,
							property: 'video:writer',
							content: writer,
						});
					});
				}

				if (config.openGraph.video.duration) {
					tagsToRender.push({
						tag: 'meta',
						key: 'video:duration',
						property: 'video:duration',
						content: config.openGraph.video.duration.toString(),
					});
				}

				if (config.openGraph.video.releaseDate) {
					tagsToRender.push({
						tag: 'meta',
						key: 'video:release_date',
						property: 'video:release_date',
						content: config.openGraph.video.releaseDate,
					});
				}

				if (
					config.openGraph.video.tags &&
					config.openGraph.video.tags.length
				) {
					config.openGraph.video.tags.forEach((tag, index) => {
						tagsToRender.push({
							tag: 'meta',
							key: `video:tag:0${index}`,
							property: 'video:tag',
							content: tag,
						});
					});
				}

				if (config.openGraph.video.series) {
					tagsToRender.push({
						tag: 'meta',
						key: 'video:series',
						property: 'video:series',
						content: config.openGraph.video.series,
					});
				}
			}
		}

		if (config.openGraph.images && config.openGraph.images.length) {
			tagsToRender.push(
				...buildOpenGraphMediaTags('image', config.openGraph.images),
			);
		}

		// videos

		if (config.openGraph.videos && config.openGraph.videos.length) {
			tagsToRender.push(
				...buildOpenGraphMediaTags('video', config.openGraph.videos),
			);
		}

		if (config.openGraph.locale) {
			tagsToRender.push({
				tag: 'meta',
				key: 'og:locale',
				property: 'og:locale',
				content: config.openGraph.locale,
			});
		}

		if (config.openGraph.site_name) {
			tagsToRender.push({
				tag: 'meta',
				key: 'og:site_name',
				property: 'og:site_name',
				content: config.openGraph.site_name,
			});
		}
	}

	if (config.canonical) {
		tagsToRender.push({
			tag: 'link',
			key: 'canonical',
			rel: 'canonical',
			href: config.canonical,
		});
	}

	if (config.additionalMetaTags && config.additionalMetaTags.length > 0) {
		config.additionalMetaTags.forEach((tag) => {
			const key = tag.keyOverride ?? tag.name ?? tag.property ?? tag.httpEquiv
			if(key) {
				tagsToRender.push({
					tag: 'meta',
					key: `meta:${key}`,
					...tag,
				});
			}
			
		});
	}

	if (config.additionalLinkTags?.length) {
		config.additionalLinkTags.forEach((tag) => {
			tagsToRender.push({
				tag: 'link',
				key: `link${tag.keyOverride ?? tag.href}${tag.rel}`,
				...tag,
			});
		});
	}

	return tagsToRender;
};

export default buildTags;
