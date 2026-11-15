import { ANNOUNCEMENT } from '../../constants/nav';

/**
 * Store-wide announcement strip above the header.
 *
 * @return {jsx}
 */
const AnnouncementBar = () => (
	<div className="bg-midnight text-center text-xs font-semibold uppercase tracking-widest text-peach/80">
		<p className="px-4 py-2">
			{ ANNOUNCEMENT.text }
			{ ANNOUNCEMENT.highlight ? <> · <span className="text-flame">{ ANNOUNCEMENT.highlight }</span></> : null }
		</p>
	</div>
);

export default AnnouncementBar;
