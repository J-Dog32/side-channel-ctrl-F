from flask import Blueprint, render_template, request, make_response

main_bp = Blueprint('main', __name__)
measure_bp = Blueprint('measure', __name__)


@main_bp.route('/')
def index():
    return render_template('index.html')

@main_bp.route('/about')
def about():
    return render_template('about.html')

@main_bp.route('/measureAll')
def measure_all():
    return render_template('measure-all.html')


@main_bp.route('/measureOne')
def measure_one():
    return render_template('measure-one.html')

@main_bp.route('/results')
def results():
    return render_template('results.html')

@main_bp.route('/poststh', methods=['POST'])
def poststh():
    return "send back"

@measure_bp.route('/poststh', methods=['POST'])
def poststh():
    return "send back"


@measure_bp.route('/frame_measure')
def frame_measure_headers():
    cycles = request.args.get('cycles') or 99
    techniques = request.args.getlist('techniques')
    headers = request.args.getlist('headers') or []

    resp = make_response(
        render_template("measure_server/frame_measure_temp.html", cycles=cycles, joint_excluded_techniques=techniques))

    return setheaders(resp, headers)


@main_bp.route('/frame_measure')
def frame_measure():
    cycles = request.args.get('cycles') or 99
    techniques = request.args.getlist('techniques')

    return render_template("measure_server/frame_measure_temp.html", cycles=cycles,
                           joint_excluded_techniques=techniques)



@main_bp.route('/measure', methods=['POST'])
def submit():
    excluded_techniques = request.form.getlist('techniques')
    excluded_levels = request.form.getlist('levels')
    all_header_level = request.form.get('level4') or "false"
    headers = request.args.getlist('headers') or []
    cycles = request.form.get('cycles') or 100

    excluded_levels.append("level4")

    print(all_header_level)

    resp = render_template("measure_server/helper.html", joint_excluded_levels=excluded_levels,
                           joint_excluded_techniques=excluded_techniques, headers=headers, cycles=cycles, level4_all=all_header_level)

    return resp

@main_bp.route('/measure_helper')
def measure_helper():
    excluded_techniques = request.args.getlist('techniques')
    excluded_levels = request.args.getlist('levels')
    headers = request.args.getlist('headers') or []
    cycles = request.args.get('cycles') or 100

    resp = make_response(render_template("measure_server/measure.html", joint_excluded_levels=excluded_levels,
                           joint_excluded_techniques=excluded_techniques, headers=headers, cycles=cycles))

    return setheaders(resp, headers)

@main_bp.route('/measure_specific', methods=['POST'])
def measure_specific():
    all_techniques = ["perfnow", "datenow", "newdate", "perfnownav", "perfnoworig", "interplperf", "interpldate", "perfobs", "postM1", "postM2", "animF", "setI_1", "setI_2", "wbwk_sab", "wbwk_Post1", "wbwk_Post2"]
    all_levels = ["level1", "level2", "level3", "level4"]
    technique = request.form.get('technique')
    escalation = request.form.get('escalation')
    headers = request.form.getlist('headerval') or []
    cycles = request.form.get('cycles') or 100

    all_techniques.remove(technique)
    all_levels.remove(escalation)

    resp = make_response(render_template("measure_server/helper.html", joint_excluded_levels=all_levels,
                           joint_excluded_techniques=all_techniques, headers=headers, cycles=cycles, level4_all="true"))

    return resp


def setheaders(resp, headers):
    if "embedderPolicy-unsafe-none" in headers:
        resp.headers.set('Cross-origin-Embedder-Policy', "unsafe-none")
    elif "embedderPolicy-require-corp" in headers:
        resp.headers.set('Cross-origin-Embedder-Policy', "require-corp")
    elif "embedderPolicy-credentialless" in headers:
        resp.headers.set('Cross-origin-Embedder-Policy', "credentialless")

    if "openerPolicy-same-origin" in headers:
        resp.headers.set('Cross-origin-Opener-Policy', "same-origin")
    elif "openerPolicy-unsafe-none" in headers:
        resp.headers.set('Cross-origin-Opener-Policy', "unsafe-none")
    elif "openerPolicy-same-origin-allow-popups" in headers:
        resp.headers.set('Cross-origin-Opener-Policy', "same-origin-allow-popups")
    elif "openerPolicy-restrict-properties" in headers:
        resp.headers.set('Cross-origin-Opener-Policy', "restrict-properties")

    if "resourcePolicy-same-site" in headers:
        resp.headers.set('Cross-origin-Resource-Policy', "same-site")
    elif "resourcePolicy-same-origin" in headers:
        resp.headers.set('Cross-origin-Resource-Policy', "same-origin")
    elif "resourcePolicy-cross-origin" in headers:
        resp.headers.set('Cross-origin-Resource-Policy', "cross-origin")

    return resp