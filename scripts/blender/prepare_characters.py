"""Create a safely isolated studio from the two supplied character masters.
Run once in a fresh Blender session. A second run refuses to overwrite the studio.
"""
import bpy
import os
import runpy
from mathutils import Vector

ROOT = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

def run():
    if bpy.data.collections.get('CHAR_Male') or bpy.data.collections.get('CHAR_Female'):
        raise RuntimeError('Character collections already exist; reopen the saved working copy instead of rebuilding.')
    os.makedirs(os.path.join(ROOT, '.qa'), exist_ok=True)
    bpy.ops.wm.save_as_mainfile(filepath=os.path.join(ROOT, '.qa', 'startup-backup.blend'), copy=True)
    scene = bpy.data.scenes.new('Valentine_Character_Studio')
    bpy.context.window.scene = scene
    for label, file in [('Male', 'male-cardigan.blend'), ('Female', 'female-grey-jeans.blend')]:
        with bpy.data.libraries.load(os.path.join(ROOT, 'art', 'characters', file), link=False) as (source, target):
            target.objects = [
                name for name in source.objects
                if name.startswith(('RW ', 'Sam ', 'shoes', 'teeth', 'eyelash', 'eyebrow', 'low-poly'))
                and not any(term in name.lower() for term in ['camera', ' rim', ' key', ' fill'])
            ]
        col = bpy.data.collections.new('CHAR_' + label)
        scene.collection.children.link(col)
        for obj in target.objects:
            if obj:
                col.objects.link(obj)
                obj.name = label + '_' + obj.name
    runpy.run_path(os.path.join(ROOT, 'scripts', 'blender', 'style_characters.py'), run_name='__main__')
    scene.frame_start = 1
    scene.frame_end = 220
    scene.render.fps = 30
    for label in ['Male', 'Female']:
        col = bpy.data.collections['CHAR_' + label]
        rig = next(obj for obj in col.objects if obj.type == 'ARMATURE')
        for side, sign in [('l', 1), ('r', -1)]:
            target = bpy.data.objects.new(label + '_Wrist_' + side, None)
            scene.collection.objects.link(target)
            constraint = rig.pose.bones['lowerarm_' + side].constraints.new('IK')
            constraint.name = 'VR_Gift_IK'
            constraint.target = target
            constraint.chain_count = 2
            constraint.use_stretch = False
            inward = 0.15 if label == 'Male' else -0.15
            for frame, y, z, shift in [
                (1, -.28, 1.21, 0), (30, -.28, 1.21, 0), (65, -.30, 1.08, 0),
                (105, -.30, 1.08, inward), (140, -.30, 1.08, inward),
                (170, -.26, 1.18, inward), (200, -.12, 1.05, 0), (220, -.12, 1.05, 0),
            ]:
                target.location = rig.matrix_world @ Vector((sign * .16 + shift, y, z))
                target.keyframe_insert('location', frame=frame)
            hand = rig.pose.bones['hand_' + side]
            hand.rotation_mode = 'XYZ'
            hand.rotation_euler = (.1, 0, sign * .15)
        for bone in rig.pose.bones:
            if any(term in bone.name.lower() for term in ['index', 'middle', 'ring', 'pinky']):
                bone.rotation_mode = 'XYZ'
                bone.rotation_euler.x = .25
        head = rig.pose.bones['head']
        head.rotation_mode = 'XYZ'
        for frame, angle in [(1, .12), (65, .24), (140, .24), (200, .04), (220, .04)]:
            head.rotation_euler.x = angle
            head.keyframe_insert('rotation_euler', frame=frame)
    scene.frame_set(1)
    runpy.run_path(os.path.join(ROOT, 'scripts', 'blender', 'export_characters.py'), run_name='__main__')

if __name__ == '__main__':
    run()
